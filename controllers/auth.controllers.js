
const {response} = require ('express');
const bcryptjs = require('bcryptjs');
const createSMS = require ('../config/sms')
const UserSignUp = require ('../models/userSignUp');
const User = require ('../models/user');
const Staff = require('../models/staff');
const { generateToken, generateRefreshToken } = require('../helpers/tokenManager');
const { checkUserEmail } = require('../helpers/check_user_type');





const phone =  async (req, res=response) => {

  try {

const { _id, phone }  = req.body;  

// console.log(_id, phone);

const user = await UserSignUp.findById(_id)||null ;

if(user != null){

//envio los datos para q se envie el sms de confirmacion
createSMS(phone, user.code);

// grabo el telefono en el usuario signUp
user.phone = phone;
await user.save();
    
}else{

    return res.status(400).json({
        success: false,
        msg: 'No se encontro Usuario en proceso de verificacion'
    });

}

res.status(200).json({
    success: true,
    msg: 'Por favor verifica tu telefono, te enviamos un mensaje de texto con un código para validar.',
});
   

} catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        msg: 'Ups algo salió mal, hable con el administrador'
    });
}
}

const signUp = async (req, res=response) => {
    
    try {

        // Obtener la data del usuario: name, email
        const { email, password, ...rest} = req.body;

        // console.log('signUp',req.body);
      

        // Verificar que el usuario no exista
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
                msg: 'Usuario en proceso de verificacion, consulte su email'
            });
        }
    }
    
        // Generar el código
        const code = Math.floor((Math.random()*(999999-123456 + 1))+123456);
       
 

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
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al registrar usuario'
        });
    }
}

const confirm = async (req, res) => {
    
    try {

       // Obtener el token
       
       const { email, code } = req.body;

       console.log(req.body);
       
              
       // Verificar existencia del usuario a confirmar
       const userToConfirm = await UserSignUp.findOne({ email })||null ;
       
       // Verificar la data

       if(userToConfirm === null) {
            return res.json({
                success: false,
                msg: 'No existe un usuario con ese email'
            });
       }

              

    //    Verificar el código
       if(code !== userToConfirm.code) {
        return res.status(400).json({
            success: false,
            msg: 'Error en la confirmacion, vuelva a intentar'
        });
       };

       if(code == userToConfirm.code) {

        // VOLVER A PONER ESTO!!!!!!!!!!!!!!!!!!
        // if(userToConfirm.state == 'VERIFIED'){
        // return res.status(400).json({
        //     success: false,
        //     msg: 'Usuario verificado, dirijase al login'
        // });
        // }
        
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

        return res.status(200).json({
            success: true,
            msg: 'Usuario autenticado correctamente',
            user
        });
    
       }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
    }
}

const login = async (req, res=response)=>{


    const { email, password } = req.body;

    try {
    // depende del valor del email del staff de cada empresa, busca en una u otra coleccion
        
         const user = await checkUserEmail(email);

        if(user){
            const checkPassword = bcryptjs.compareSync(password, user.password)
            if(!checkPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Password incorrecto'
                })}
        }
        
        /* si llego hasta aca es xq el usuario login ya esta creado y entonces el usuario tambien ya se creo aunque
        me falten datos, como la app tiene delivery tengo mas instancias para recolectar datos.
        Aca abajo lo mismo, tiene q ver con el TIPO de email  */ 
        
        const token = generateToken(user._id);
        generateRefreshToken(user._id, res);

         res.status(200).json({
            success: true,
            token,
            user
        })


   } catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador',
            success: false
        })       
    }
}

const emailToAsyncValidatorLogin = async (req, res) => {

    try {
      const email = req.query.q;
      const emailToCheck = email.split('@');
      let user = null;
  
      if (emailToCheck[1].includes(process.env.EMAILSTAFF)) {
        user = await Staff.findOne({ email });
      } else {
        user = await User.findOne({ email });
      }

      console.log(user);
      // esto se ve raro xq uso una validacion asyncrona el formularios reactivos
      if (!user) {
        
        return res.status(400).json({
            success: false,
            msg: `No existe usuario con el email ${email} en nuestra base de Datos`
        })

      }else{      
        res.status(200).json({
          success: true,
          msg: 'Usuario OK'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Ups! algo salió mal, reintentá más tarde'
      });
    }
};

const emailToAsyncValidatorRegister = async (req, res) => {

    try {
      const email = req.query.q;
      const emailToCheck = email.split('@');
      let user = null;
  
      if (emailToCheck[1].includes(process.env.EMAILSTAFF)) {
        user = await Staff.findOne({ email });
      } else {
        user = await User.findOne({ email });
      }

      // esto se ve raro xq uso una validacion asyncrona el formularios reactivos
      if (!user) {
       
         return res.status(200).json({
            success: true,
            msg: 'Email válido'
          });
      }else{
        return res.status(400).json({
            success: false,
            msg: `Ya existe usuario con el email ${email} en nuestra base de Datos`
        })
    
    }
    
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Ups! algo salió mal, reintentá más tarde'
      });
    }
};

const refreshToken = async (req, res) => {

    const _id = req._id
    // console.log('_id desde refresh controller', _id);
    try {
        const { token, expiresIn } = generateToken (_id);
        // console.log(token);
        const user = await User.findById(_id) || null;
        // console.log("desde refreshToken: ", user);


        
        return res.json({
             token,
             user,
             expiresIn
             });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error de server" });
    }
};

const logout = (req, res) => {
    
    res.clearCookie("refreshToken");
    res.json({ ok: true });
};

module.exports={
    login, 
    signUp,
    confirm,
    phone,
    refreshToken,
    logout,
    emailToAsyncValidatorLogin,
    emailToAsyncValidatorRegister,

}

