
// const Staff = require('../models/staff');


const adminRole= ( req, res, next )=>{

    if(!req.staffAuth){
        return res.status(500).json({
            msg: 'se intenta verificar el role sin validar el token primero'
        })
    }

    const { role, firstName, lastName } = req.staffAuth;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${firstName} ${lastName} no es un usuario ADMIN_ROLE, no puede realizar esta acción`
        });
    }
next();
}

const superRole= ( req, res, next )=>{

    if(!req.staffAuth){
        return res.status(500).json({
            msg: 'se intenta verificar el role sin validar el token primero'
        })
    }

    const { role, firstName, lastName } = req.staffAuth;
    if(role !== 'SUPER_ROLE'){
        return res.status(401).json({
            msg: `${firstName} ${lastName} no es un usuario SUPER_ROLE, no puede realizar esta acción`
        });
    }
next();
}


const multiRole= (...roles) => {
 return (req, res, next) => {

    if(!req.staffAuth){
        return res.status(500).json({
            msg: 'se intenta verificar el role sin validar el token primero'
        })
    }

    if(!roles.includes(req.staffAuth.role)){


        return res.status(401).json({
            msg: `esta accion  requiere de un Usuario con estos roles: ${roles}`
        })
    }
    next();
}

}



module.exports= { 
    adminRole,
    multiRole,
    superRole
    }