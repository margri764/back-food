

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { userPost } = require('../controllers/staff.controllers');
const { checkToken, superRole, checkFields, checkTokenStaff, multiRole } = require('../middlewares')
const { isRoleValid } = require('../helpers/db-validators');
const { getOrder, } = require('../controllers/purchaseOrder.controllers');


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE
//estas son las rutas de lo q puede o no hacer un empleado

router.post('/',[
    checkTokenStaff,
    superRole,
    checkFields
    
],userPost); 

router.get('/order',[
    checkTokenStaff,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
],getOrder); 

// router.put('/orderStatus/:id',[
//     checkTokenStaff,
//     multiRole("SUPER_ROLE","ADMIN_ROLE"),
//     checkFields
// ],editOrderStatus); 


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