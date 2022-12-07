


// const jwt = require ('jsonwebtoken');
const User= require ('../models/user');


const checkToken = async ( req , res, next)=>{

    const token = req.header ( 'x-token' ); 
    const _id = token;

    if(!token){ 
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }

    try {

               
        // const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioAuth = await User.findById( _id );

        if(!usuarioAuth){
            return res.status(401).json({
                msg:'Token no valido - Usuario no existe en DB'
            })
        }

        if(!usuarioAuth.stateAccount){
            return res.status(401).json({
                msg:'Token no valido - usuario con state en false'
            })
        }

        req.userAuth= usuarioAuth;

        next(); 

    } catch (error) {
        return res.status(401).json({ 
            msg: 'token no valido'
    })




 }
}

module.exports={checkToken};