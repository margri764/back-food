
const jwt = require ('jsonwebtoken');
const User =  require('../models/user');
const Staff =  require('../models/staff');
const tokenVerificationErrors   = require ("../helpers/tokenManager");


const requireToken = async ( req, res, next ) => {

    try {

        let token = req.headers?.authorization;
        console.log(req.body);
        // console.log("requireToken token Bearer: ", token);

        if(!token){
            return res.status(400).json({
                msg:'No existe el token en el header. Vuelva a entrar con sus credenciales'
            })
        }

        token = token.split(" ")[1];

        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        let userAuth = null;
        let userStaff = null;

        // lo tengo separado xq hay dos colecciones de usuarios de la app
         userAuth = await User.findById( _id ) ;
         userStaff = await Staff.findById( _id );


        if(userAuth == null && userStaff == null){
              return res.status(500).json({
                  msg:'Token no valido - Usuario no existe en DBdddd'
              })
        }

        if( userAuth ) {

            if(userAuth.stateAccount == false){
                return res.status(500).json({
                msg:'Token no valido - usuario con state en false'
                })
            }
            if( userAuth.state=='UNVERIFIED'){
                return res.status(401).json({
                    success: false,
                    msg: 'Usuario en proceso de verificacion, consulte su teléfono'
                });
            }
             req.userAuth= userAuth;    
        } 
        
        if( userStaff ) {
          
            if(userStaff.stateAccount == false){
                return res.status(500).json({
                    msg:'Token no valido - usuario con state en false'
                    })
                }
            req.userAuth= userStaff;
        }
        next();
        
    } catch (error) {
        console.log('desde requireToken: ', error);
        return res
        .status(401)
        .send ({error : tokenVerificationErrors[error.message]})
    }

}



module.exports={ requireToken }