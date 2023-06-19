
const {response} = require ('express');
const bcryptjs = require('bcryptjs');
const createSMS = require ('../config/sms')
const UserSignUp = require ('../models/userSignUp');
const User = require ('../models/user');
const Staff = require('../models/staff');
const LoginAttempt = require('../models/loginAttempt');
const { generateToken, generateRefreshToken } = require('../helpers/tokenManager');
const { checkUserEmail } = require('../helpers/check_user_type');
const { sendEmail } = require('../config/mail.config');
const crypto = require('crypto');


const phone =  async (req, res=response) => {

try {

const { phone, email }  = req.body;  

      const user = await UserSignUp.findOne({ email }) ;
      
      if(!user) {
          return res.status(400).json({
              success: false,
              msg: 'No existe un usuario con ese email'
          });
      }

//envio los datos para q se envie el sms de confirmacion
// await createSMS(phone, user.code);

      //envio los datos para q se envie el sms de confirmacion
      await new Promise((resolve, reject) => {
        createSMS(phone, user.code)
          .then(() => resolve())
          .catch((error) => reject(error));
      });

// grabo el telefono en el usuario signUp
user.phone = phone;

await user.save();

res.status(200).json({
    success: true,
    msg: 'Por favor verifica tu telefono, te enviamos un mensaje de texto con un código para validar.',
});

} catch (error) {
    console.log("error desde Phone: ",error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';
    
    if(error.message.includes('El número de teléfono ingresado no es válido')|| error.message === "Error al enviar el mensaje"){
      errorMessage = error.message;

    }
    return res.status(500).json({
        success: false,
        msg: errorMessage
    });
}
}

const signUp = async (req, res=response) => {

    try {

        // Obtener la data del usuario: name, email
        const { email, password, ...rest} = req.body;


        //dice que busque un email y puede ser que este en null, dice "buscalo o sino devolve null"
        let user = await User.findOne({ email }) || null;

       if(user != null){
        if(user.state =='VERIFIED'  ) {
 
            return res.status(202).json({
                success: true,
                msg: 'Usuario verificado, dirijase al Login'
            });
        }
        if( user.state=='UNVERIFIED'){
            return res.status(401).json({
                success: false,
                msg: 'Usuario en proceso de verificación',
                phone: user.phone
            });
        }
    }
    
        // Generar el código
        const code = Math.floor(Math.random() * 900000) + 100000;
       
        // Crear un nuevo usuario
        user = new UserSignUp({email, password, code, ...rest});
        
        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password,salt);

    await user.save();
       
    res.status(200).json({
        success: true,
        user
    });

    } catch (error) {
        console.log("error desde signUp: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Ups algo salió mal, hable con el administrador'
        });
    }
}

const resendCode = async (req, res=response) => {

  try {

      // Obtener la data del usuario: name, email
      const { email, phone } = req.body;


      //dice que busque un email y puede ser que este en null, dice "buscalo o sino devolve null"
      let user = await UserSignUp.findOne({ email });

     if(user){
      if(user.state =='VERIFIED'  ) {

          return res.status(202).json({
              success: true,
              msg: 'Usuario verificado, dirijase al Login'
          });
      }
     }

     user.attempts = 0;
      // Generar el código
      const code = Math.floor(Math.random() * 900000) + 100000;
      
      //envio los datos para q se envie el sms de confirmacion
      // await new Promise((resolve, reject) => {
      //   createSMS(phone, code)
      //     .then(() => resolve())
      //     .catch((error) => reject(error));
      // });
  

      user.code = code;

      if(phone !== undefined || phone !== null){
         user.phone = phone;
      }

      await user.save();
        
      res.status(200).json({
          success: true,
          user
      });

  } catch (error) {

    let errorMessage = 'Ups algo salió mal, hable con el administrador';

    if(error.message.includes('El número de teléfono ingresado no es válido') || error.message.includes('Error al enviar el mensaje') ){
      errorMessage = error.message;
    }else{
      console.log("error desde resendCode: ", error);

    }

    return res.status(500).json({
        success: false,
        msg: errorMessage
    });
    
  }
}

const generateTokenToPassword = async (req, res=response) => {
    
    try {

        // Obtener la data del usuario: name, email
        const { email } = req.body;
       
        let emailToCheck = email.split("@");
        const isStaff = emailToCheck[1].includes(process.env.EMAILSTAFF);

        if(isStaff){
          return res.status(400).json({
            success: false,
            msg: "Miembros del staff comunicarse con el administrador"
          })
        }
        let user = await User.findOne({email})

        // Generar un token de restablecimiento de contraseña
        const resetToken = crypto.randomBytes(20).toString('hex');
        // Guardar el token en la base de datos y establecer una fecha de vencimiento
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

       await sendEmail(email, resetToken)

        await user.save();

       
    res.status(200).json({
        success: true,
        msg: 'Te enviamos un email para validar tu nueva contraseña'
    });
    

    } catch (error) {
        console.log("Error desde generateTokenToPassword: ", error);
       let errorMessage = 'Ups algo salió mal, hable con el administrador';
        
        // if(error.message === "Algo salió mal el enviar email de confirmación. Hable con el administrador"){
        //     errorMessage = error.message
        // }
        return res.status(500).json({
            success: false,
            msg: errorMessage
        });
    }
}

const resetPassword = async (req, res) => {
    try {
      const { resetToken, password } = req.body;
  
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() } // Comprobar si el token no ha expirado
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'El token de restablecimiento de contraseña no es válido o ha expirado'
        });
      }
  
      // Hash de la nueva contraseña
     const salt = bcryptjs.genSaltSync();
     const hashedPassword =  bcryptjs.hashSync(password, salt);
  
      // Actualizar la contraseña del usuario y borrar el token de restablecimiento
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      // Enviar respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Se ha restablecido la contraseña correctamente'
      });
  
    } catch (error) {
      console.error("Error desde resetPassword: ",error);
      res.status(500).json({
        success: false,
        message: 'Ups algo salió mal, hable con el administrador'
      });
    }
};

const confirm = async (req, res) => {
    
    try {

       // Obtener el token
       
       const { email, code } = req.body;

       // Verificar existencia del usuario a confirmar
       const userToConfirm = await UserSignUp.findOne({ email }) ;
       
       // Verificar la data

       if(!userToConfirm) {
            return res.status(400).json({
                success: false,
                msg: 'No existe un usuario con ese email'
            });
       }

    //    Verificar el código
       if(code !== userToConfirm.code) {

        // Incrementar el contador de intentos fallidos
        userToConfirm.attempts = userToConfirm.attempts ? userToConfirm.attempts + 1 : 1;
        await userToConfirm.save();

        if (userToConfirm.attempts >= 3) {
            return res.status(400).json({
                success: false,
                msg: 'Te enviaremos un nuevo código'
            });
        }
        return res.status(400).json({
            success: false,
            msg: 'Código ingresado incorrecto, vuelva a intentar.'
        });

       }else if(code == userToConfirm.code) {

        if(userToConfirm.state == 'VERIFIED'){
        return res.status(400).json({
            success: false,
            msg: 'Usuario verificado, dirijase al login'
        });
        }
        
   // Actualizo el usario signUp
        userToConfirm.state = 'VERIFIED';
        await userToConfirm.save();

        /*    asigno los datos del usuario login y de esa manera creo el nuevo Usuario (me van a faltar datos q en algun 
    momento se les piden al usuario desde el FrontlineApi, por ejemplo para delivery) */
    
       const newUser = {
          firstName : userToConfirm.firstName,
          lastName : userToConfirm.lastName,
          email : userToConfirm.email,
          password : userToConfirm.password,
          phone: userToConfirm.phone,
          user_login : userToConfirm._id,
        }

        //grabo el nuevo usuario confirmado
        const user = new User (newUser);
        await user.save();

        const token = generateToken(user._id);
        generateRefreshToken(user._id, res);

        return res.status(200).json({
            success: true,
            msg: 'Usuario autenticado correctamente',
            user, 
            token
        });
    
       }
    } catch (error) {
        console.log("Error desde Confirm ", error);
        return res.status(500).json({
            success: false,
            msg: 'Ups algo salió mal, hable con el administrador'
        });
    }
}

const login = async (req, res=response)=>{

  const MAX_LOGIN_ATTEMPTS = 5; // número máximo de intentos de inicio de sesión permitidos
  const LOCK_TIME = 5 * 60 * 1000; // tiempo de bloqueo en milisegundos después de superar el límite de intentos

   
    const { email, password } = req.body;

    try {

      const user = await checkUserEmail(email);

      // Verificar si el usuario ha superado el límite de intentos de inicio de sesión
      const loginAttempts = await LoginAttempt.find({ email, timestamp: { $gte: new Date(Date.now() - LOCK_TIME) } });
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts.length;

      if (loginAttempts.length >= MAX_LOGIN_ATTEMPTS) {
        return res.status(429).json({
          success: false,
          msg: `Ha superado el límite de ${MAX_LOGIN_ATTEMPTS} intentos de inicio de sesión. Por favor, espere ${LOCK_TIME / 60 / 1000} minutos antes de intentar de nuevo.`
        });
      }
      
      if (!user) {
        await LoginAttempt.create({ email,  timestamp: Date.now() });
        return res.status(401).json({
          success: false,
          msg: 'Credenciales incorrectas'
        });
      }
      
      const checkPassword = bcryptjs.compareSync(password, user.password)
      if (!checkPassword) {
        await LoginAttempt.create({ email, timestamp: Date.now() });
        return res.status(401).json({
          success: false,
          msg: 'Credenciales incorrectas',
          remainingAttempts
        });
      }
      
      await LoginAttempt.deleteMany({ email });
        
        /* si llego hasta aca es xq el usuario login ya esta creado y entonces el usuario tambien ya se creo aunque
        me falten datos, como la app tiene delivery tengo mas instancias para recolectar datos.
        Aca abajo lo mismo, tiene q ver con el TIPO de email  */ 
        const token = generateToken(user._id);
        generateRefreshToken(user._id, res);

         return res.status(200).json({
            success: true,
            token,
            user
        })


   } catch (error) {
     
    console.log('Error desde Login:', error);
    let errorMessage = 'Ups, algo salió mal. Por favor, contacta al administrador.';
    if (
      error.message.includes('La cuenta del staff') ||
      error.message.includes('La cuenta del usuario') ||
      error.message.includes('La cuenta de usuario no ha sido verificada') ||
      error.message.includes('El email') ||
      error.message.includes('necesita verificar su cuenta')

    ) {
      errorMessage = error.message;
    }


      res.status(500).json({
          success: false,
          msg: errorMessage
      })       
    }
}

const emailToAsyncValidatorLogin = async (req, res) => {
  try {
    const email = req.query.q;
    const emailToCheck = email.split('@');
    const isStaff = emailToCheck[1].includes(process.env.EMAILSTAFF);

    const query = isStaff ? Staff.findOne({ email }) : User.findOne({ email });
    const userSignUp = await UserSignUp.findOne({ email });

    let response = null;

    if (userSignUp) {
      if (userSignUp.state === 'UNVERIFIED') {
        response = {
          success: false,
          msg: `El usuario con el email ${email} necesita verificar su cuenta`
        };
      }
    }

    if (!response) {
      const user = await query.lean();

      if (!user) {
        response = {
          success: false,
          msg: `No existe usuario con el email ${email} en nuestra base de datos`
        };
      } else if (userSignUp && userSignUp.state === 'UNVERIFIED') {
        response = {
          success: false,
          msg: `El usuario con el email ${email} necesita verificar su cuenta`
        };
      } else {
        response = {
          success: true,
          msg: 'Usuario OK'
        };
      }
      
    }

    res.status(200).json(response);

  } catch (error) {
    console.log('Error desde emailToAsyncValidatorLogin: ', error);
    res.status(500).json({
      success: false,
      msg: 'Ups algo salió mal, hable con el administrador'
    });
  }
};

const emailToAsyncValidatorRegister = async (req, res) => {

    try {
      const email = req.query.q;
      const emailToCheck = email.split('@');
      const isStaff = emailToCheck[1].includes(process.env.EMAILSTAFF);

      const query = isStaff ? Staff.findOne({ email }) : User.findOne({ email });
  
      const user = await query.lean();

      // esto se ve raro xq uso una validacion asyncrona el formularios reactivos
      if (!user) {
       
         return res.status(200).json({
            success: true,
            msg: 'Email válido'
          });
      }else{
        return res.status(200).json({
            success: false,
            msg: `Ya existe usuario con el email ${email} en nuestra base de Datos`
        })
    
    }
    
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Ups algo salió mal, hable con el administrador'
      });
    }
};

const refreshToken = async (req, res) => {

    const _id = req._id
    try {
        const { token, expiresIn } = generateToken (_id);
        
        return res.json({
             token,
             expiresIn
             });

    } catch (error) {
        console.log("Error desde refreshToken", error);
        return res.status(500).json({ 
          success: false,
          msg: 'Ups algo salió mal, hable con el administrador'
        });
    }
};

const logout = (req, res) => {
  if (req.cookies.refreshToken) {
      res.clearCookie("refreshToken");
  }
  res.json({ ok: true });
};

module.exports={
    login, 
    signUp,
    resendCode,
    generateTokenToPassword,
    resetPassword,
    confirm,
    phone,
    refreshToken,
    logout,
    emailToAsyncValidatorLogin,
    emailToAsyncValidatorRegister,

}

