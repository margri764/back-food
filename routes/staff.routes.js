

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { userPost } = require('../controllers/staff.controllers');
const { checkToken, superRole, checkFields, checkTokenStaff } = require('../middlewares')
const { isRoleValid } = require('../helpers/db-validators')


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE

router.post('/',[
    checkTokenStaff,
    superRole,
    checkFields
    
],userPost); 


// SOLO EL SUPER ROLE PUEDE ENTRAR AQUI!!!

// router.delete('/:id',
// [
//     checkToken,
//     multiRole ('ADMIN_ROLE','USER_ROLE',''),
//     check('id','No es un id valido de mongoDB').isMongoId(),
//     check('id').custom( checkId ),
//     checkFields
// ], usersDelete);








module.exports= router;