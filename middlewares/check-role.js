
// const Staff = require('../models/staff');

const userRole= (role) => {

    return (req, res, next) => {
   
       if(!req.userAuth){
           return res.status(500).json({
               msg: 'se intenta verificar el role sin validar el token primero'
           })
       }
   
       if(!role == req.userAuth.role){
   
           return res.status(403).json({
               msg: `esta accion  requiere de un Usuario con estos roles: ${roles}`
           })
       }
       next();
   }
}


const adminRole= ( req, res, next )=>{

    if(!req.userAuth){
        return res.status(500).json({
            msg: 'se intenta verificar el role sin validar el token primero'
        })
    }

    const { role, firstName, lastName } = req.userAuth;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${firstName} ${lastName} no es un usuario ADMIN_ROLE, no puede realizar esta acción`
        });
    }
next();
}

const superRole= ( req, res, next )=>{

    if(!req.userAuth){
        return res.status(500).json({
            msg: 'se intenta verificar el role sin validar el token primero'
        })
    }

    const { role, firstName, lastName } = req.userAuth;
    if(role !== 'SUPER_ROLE'){
        return res.status(401).json({
            msg: `${firstName} ${lastName} no es un usuario SUPER_ROLE, no puede realizar esta acción`
        });
    }
next();
}


const multiRole= (...roles) => {

 return (req, res, next) => {

    if(!req.userAuth){
        return res.status(500).json({
            msg: 'Se intenta verificar el role sin validar el token primero'
        })
    }

    const userRole = req.userAuth.role;
    console.log(userRole);
    console.log(roles);


    if(!roles.includes(userRole)){

        return res.status(403).json({
            msg: `Esta accion requiere de un Usuario con estos roles: ${roles}`
        })
    }
    next();
}

}



module.exports= { 
    adminRole,
    multiRole,
    superRole,
    userRole
    }