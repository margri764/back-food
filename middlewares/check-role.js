

const adminRole= ( req, res, next )=>{

        if(!req.usuarioAuth){
            return res.status(500).json({
                msg: 'se intenta verificar el role sin validar el token primero'
            })
        }

        const { role, name } = req.usuarioAuth;
        if(role !== 'ADMIN_ROLE'){
            return res.status(401).json({
                msg: `${name} no es un administrador`
            });
        }
    next();
}

const multiRole= (...roles) => {
     return (req, res, next) => {

        if(!req.usuarioAuth){
            return res.status(500).json({
                msg: 'se intenta verificar el role sin validar el token primero'
            })
        }

        if(!roles.includes(req.usuarioAuth.role)){
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles: ${roles}`
            })
        }
        next();
    }

}

module.exports= { adminRole, multiRole}