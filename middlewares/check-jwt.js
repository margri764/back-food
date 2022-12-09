


const jwt = require ('jsonwebtoken');
const User = require ('../models/user');
const Staff = require ('../models/staff');



const checkToken = async ( req , res, next)=>{

    let token = req.header ( 'x-token' ); 

    // console.log('token: ', token);

    if(!token){ 
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }

    try {

        //desde aca saca el id de la persona logeada la cual se graba en el token
               
        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        
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

        //si el usuario tiene un token autorizado, guardo sus datos en la req y eso me sirve para llamar a ese req.userAuth en todo el path de la ruta
        req.userAuth= usuarioAuth; 

        next(); 

    } catch (error) {
        return res.status(401).json({ 
            msg: 'Error al intentar obtener token'
    })
 }
}


const checkTokenStaff = async ( req , res, next)=>{

    let token = req.header ( 'x-token' ); 

    // console.log('token: ', token);

    if(!token){ 
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }

    try {

        //desde aca saca el id de la persona logeada la cual se graba en el token
               
        const { _id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const staffAuth = await Staff.findById( _id );

        // console.log(_id);

        if(!staffAuth){
            return res.status(401).json({
                msg:'Token no valido - Usuario no existe en DB'
            })
        }

        if(!staffAuth.stateAccount){
            return res.status(401).json({
                msg:'Token no valido - usuario con state en false'
            })
        }

        //si el usuario tiene un token autorizado, guardo sus datos en la req y eso me sirve para llamar a ese req.userAuth en todo el path de la ruta
        req.staffAuth= staffAuth; 

        next(); 

    } catch (error) {
        return res.status(401).json({ 
            msg: 'Error al intentar obtener token'
    })
 }
}
module.exports={
                checkToken,
                checkTokenStaff
               };