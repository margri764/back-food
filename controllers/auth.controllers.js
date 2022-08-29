const {response} = require ('express');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require ('bcryptjs');


const UserLogin = require ('../models/user-login');
const User = require ('../models/user');

const Code = require ('../models/qr.js');
const Pet = require ('../models/pet.js');


const { getToken, getTokenData } = require('../config/jwt.config');
const { sendEmail, getTemplate } = require('../config/mail.config');




const signUp = async (req, res=response) => {
    
    try {

        // Obtener la data del usuario: name, email
        const { email, password, codeQR } = req.body;
        console.log(req.body);

        // Verificar que el usuario no exista
        //dice que busque un email y puede ser que este en null, dice "buscalo o sino devolve null"
        let userLogin = await UserLogin.findOne({ email }) || null;

       if(userLogin != null){
        if(userLogin.state=='VERIFIED'  ) {
 
            return res.status(202).json({
                success: true,
                msg: 'Usuario verificado, dirijase al Login'
            });
        }
        if( userLogin.state=='UNVERIFIED'){
            return res.status(401).json({
                success: false,
                msg: 'Usuario en proceso de verificacion, consulte su email'
            });
        }
    }
    
        // Generar el código
        const code = uuidv4();
  

        // Crear un nuevo usuario
        userLogin = new UserLogin({ password, email, code, codeQR });
         
        
        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        userLogin.password = bcryptjs.hashSync(password,salt);

        // Generar token
        const token = getToken({email, code });

        // Obtener un template - es el cuerpo del email q se envia al usuario
        const template = getTemplate(token);

        // Enviar el email
        await sendEmail(email, 'Este es un email de prueba', template);
        await userLogin.save();

        res.status(200).json({
            success: true,
            msg: 'Por favor verifica tu correo, te enviamos un email de verificación'
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
  
       const { token } = req.params;

        
       
       // Verificar la data
       const data = await getTokenData(token);

       if(data === null) {
            return res.json({
                success: false,
                msg: 'Error al obtener data'
            });
       }

       const { email, code } = data.data;

       // Verificar existencia del usuario
       const user = await UserLogin.findOne({ email })||null ;
       
       
       //busco si existe el codigo en BD
       const codeInDB = await Code.findById(user.codeQR);
         
            console.log(codeInDB);
     
        //response NO EXISTE
        if(codeInDB == null){
            return res.status(400).json({
                success: false,
                msg: 'Codigo QR no existe'
            });
        }
    
        let pathImage= codeInDB;
    
 

       if(user===null ) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no existe'
            });
       }

    //    Verificar el código
       if(code !== user.code) {
        return res.status(400).json({
            success: false,
            msg: 'Error en la confirmacion, vuelva a intentar'
        });
       }

       // Actualizar usuario
       user.state = 'VERIFIED';
       await user.save();

       

       res.status(200).json({
           success:true,
           msg:'Cuenta verificada, te redirecionaremos para que cargues los datos de tu mascota',
           user,
           pathImage
       })

 
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
    }
}


const login = async (req, res=response)=>{

    const {email, password} = req.body;
    console.log(req.body);

   try {
       
        const user = await User.findOne({email}) ;

        const userNoAccount = await UserLogin.findOne({email});
        
        if(user){
            const checkPassword = bcryptjs.compareSync(password, user.password)
            if(!checkPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Password incorrecto'
                })
            }
        }
        if(userNoAccount){
            const checkPasswordNoAcc= bcryptjs.compareSync(password, userNoAccount.password)
            if(!checkPasswordNoAcc) {
                return res.status(400).json({
                    success: false,
                    msg: 'Password incorrecto...'
                })
            }
     } 

        if(!user && userNoAccount) {
            return res.json({
                success: false,
                msg: 'Falta crear Usuario'
            });
        }

        if(!user) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no registrado, dirijase a Registro'
            });
        }

        if(user.emailVerified == false) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario en proceso de verificacion, revise su Email'
            })
        }

        // const token = await setJWT(user.id);

         res.status(200).json({
            success: true,
            user
            })


   } catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador'
        })       
    }
}


const revalidateJWToken = async(req, res = response ) => {

    const { id } = req.header('token');
    console.log('revalidate')

    // Generar el JWT
    const token = await setJWT( id );

    return res.json({
        success: true,
        id, 
        token
    });

}



module.exports={
    login, 
    signUp,
    confirm,
    revalidateJWToken
}

