


const jwt = require ('jsonwebtoken');
const User = require ('../models/user');
const Staff = require ('../models/staff');

const checkUserTokenRevalidate = async ( req , res, next)=>{

    let token = req.header ( 'x-token' ); 
     let expired = false;
     let invalid = false;

    // console.log('user token: ', token);

    if(!token){ 
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }

    try {

        //desde aca saca el id de la persona logeada la cual se graba en el token, si se produce un error de expiracion o inavlido xq se manipulo el jwt salta un error 
        const { _id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY,
            async (err)=>{
                        if(err){
                            if (err.message === "jwt expired") {
                                expired = true;
                            }
                            if (err.message === "invalid signature") {
                                invalid = true;
                            }
                         
                        }
                    }) 
         if(invalid){
             return res.status(401).json({
                 msg:'Token invalido o manipulado!!!!'
             });
         }
            
        if(expired ){

            // res.setHeader("x-token", tokenNuevo);
            return res.status(401).json({
                msg:'Token expirado'
            });
        }
                       
     
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
        return res.status(400).json({ 
            msg: 'Error al obtener Token'
    })
 }
}


const checkToken = async ( req , res, next)=>{

    let token = req.header ( 'x-token' ); 
    let expired = false;
    let invalid = false;

   // console.log('user token: ', token);

   if(!token){ 
       return res.status(401).json({
           msg: 'no hay token en la peticion'
       });
   }

   
   try {

       //desde aca saca el id de la persona logeada la cual se graba en el token, si se produce un error de expiracion o inavlido xq se manipulo el jwt salta un error 
       const { _id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY,
           async (err)=>{
                       if(err){
                           if (err.message === "jwt expired") {
                               expired = true;
                                     
                                    // Generar el JWT
                        //   const token = await JWTGenerator(user._id)
                           }
                           if (err.message === "invalid signature") {
                               invalid = true;
                           }
                        
                       }
                   }) 
        if(invalid){
            return res.status(401).json({
                msg:'Token invalido o manipulado!!!!'
            });
        }
           
       if(expired ){

        // Generar el JWT
        //   const token = await JWTGenerator(user._id)

        //    res.setHeader("x-token", tokenNuevo);
           return res.status(401).json({
               msg:'Token expirado'
           });
       }
     
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
        return res.status(400).json({ 
            msg: 'Error al obtener Token'
    })
 }
}


const checkTokenStaff = async ( req , res, next)=>{

    let token = req.header ( 'x-token' ); 
    let expired = false;
    let invalid = false;


   if(!token){ 
       return res.status(401).json({
           msg: 'no hay token en la peticion'
       });
   }

   try {

       //desde aca saca el id de la persona logeada la cual se graba en el token, si se produce un error de expiracion o inavlido xq se manipulo el jwt salta un error 
       const { _id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY,
           async (err)=>{
                       if(err){
                           if (err.message === "jwt expired") {
                               expired = true;
                           }
                           if (err.message === "invalid signature") {
                               invalid = true;
                           }
                        
                       }
                   }) 
        if(invalid){
            return res.status(401).json({
                msg:'Token invalido o manipulado!!!!'
            });
        }
           
       if(expired ){

           // res.setHeader("x-token", tokenNuevo);
           return res.status(401).json({
               msg:'Token expirado'
           });
       }

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
                checkTokenStaff,
                checkUserTokenRevalidate
               };