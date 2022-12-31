
const jwt = require ('jsonwebtoken');
const  User =  require('../models/user');
const  tokenVerificationErrors   = require ("../helpers/tokenManager");


const requireToken = async ( req, res, next ) => {

    try {

        let token = req.headers?.authorization;

        console.log("requireToken token Bearer: ", token);

        if(!token){
            throw new Error ('No existe el token en el header')
        }

        token = token.split(" ")[1];

        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const userAuth = await User.findById( _id );

        if(!userAuth){
            return res.status(401).json({
                msg:'Token no valido - Usuario no existe en DB'
            })
        }

        if(!userAuth.stateAccount){
            return res.status(401).json({
                msg:'Token no valido - usuario con state en false'
            })
        }

        //si el usuario tiene un token autorizado, guardo sus datos en la req y eso me sirve para llamar a ese req.userAuth en todo el path de la ruta
        req.userAuth= userAuth;

        next();
        
    } catch (error) {

        return res
        .status(401)
        .send ({error : tokenVerificationErrors[error.message]})
    }

}

module.exports={ requireToken }