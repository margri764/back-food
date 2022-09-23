const {response} = require ('express');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require ('bcryptjs');
const createSMS = require ('../config/sms')

const UserLogin = require ('../models/user-login');
const User = require ('../models/user');








const signUp = async (req, res=response) => {
    
    try {

        // Obtener la data del usuario: name, email
        const { email, password } = req.body;
        console.log(req.body);

        // Verificar que el usuario no exista
        //dice que busque un email y puede ser que este en null, dice "buscalo o sino devolve null"
        let userLogin = await UserLogin.findOne({ email }) || null;

       if(userLogin != null){
        if(userLogin.state =='VERIFIED'  ) {
 
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
        const code = Math.floor((Math.random()*(999999-123456 + 1))+123456);
  

        // Crear un nuevo usuario
        userLogin = new UserLogin({ password, email, code });
         
        
        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        userLogin.password = bcryptjs.hashSync(password,salt);

       
        //envio los datos para q se envie el sms de confirmacion
        // createSMS("+542302690139",code);
            
          
        await userLogin.save();

        res.status(200).json({
            success: true,
            msg: 'Por favor verifica tu telefono, te enviamos un mensaje de texto con un código para validar.',
            userLogin
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
       const userToConfirm = await UserLogin.findOne({ email })||null ;
       
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

       const newUser = {
            email : userToConfirm.email,
            password : userToConfirm.password,
            user_login : userToConfirm._id

       }

    //    grabo el nuevo usuario confirmado
       const user = new User (newUser);
       await user.save();

        // Actualizar usuario
        userToConfirm.state = 'VERIFIED';
        await userToConfirm.save();


       

       if(code == userToConfirm.code) {
        return res.status(200).json({
            success: true,
            msg: 'Usuario autenticado correctamente',
            user
        });
    
       }


 
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
    }
}


const login = async (req, res=response)=>{

    const {email, password, remember} = req.body;

    try {
        
        const user = await UserLogin.findOne({email}) ;
        
        if(user){
            const checkPassword = bcryptjs.compareSync(password, user.password)
            if(!checkPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Password incorrecto'
                })
            }
        }
        
        if(!user) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no registrado, dirijase a Registro'
            });
        }
        
        if(user.state == false) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario en proceso de verificacion, revise su Email'
            })
        }
        

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

