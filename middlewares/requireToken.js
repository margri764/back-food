
const jwt = require ('jsonwebtoken');
const  User =  require('../models/user');
const  Staff =  require('../models/staff');
const  tokenVerificationErrors   = require ("../helpers/tokenManager");


const requireToken = async ( req, res, next ) => {

    try {

        let token = req.headers?.authorization;

        // console.log("requireToken token Bearer: ", token);

        if(!token){
            throw new Error ('No existe el token en el header')
        }

        token = token.split(" ")[1];

        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let userAuth;
        let userStaff;
        

        // lo tengo separado xq hay dos colecciones de usuarios de la app
         userAuth = await User.findById( _id ) || null;
         userStaff = await Staff.findById( _id ) || null;


        if(userAuth == null && userStaff == null){
              return res.status(500).json({
                  msg:'Token no valido - Usuario no existe en DB'
              })
        }


        if( userAuth != null) {

            if(userAuth.stateAccount == false){
                return res.status(500).json({
                msg:'Token no valido - usuario con state en false'
                })
                }
             req.userAuth= userAuth;    
        } 
        
        if( userStaff != null) {
          
            if(userStaff.stateAccount == false){
                return res.status(500).json({
                    msg:'Token no valido - usuario con state en false'
                    })
                }
            req.userAuth= userStaff;
        }



        next();
        
    } catch (error) {

        return res
        .status(401)
        .send ({error : tokenVerificationErrors[error.message]})
    }

}



module.exports={ requireToken }