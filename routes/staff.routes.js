

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { userPost } = require('../controllers/staff.controllers');
const { superRole, checkFields, checkTokenStaff, multiRole, requireToken } = require('../middlewares')
const { isRoleValid } = require('../helpers/db-validators');
const { getOrder, createOrder, } = require('../controllers/purchaseOrder.controllers');
const { getStaffOrders } = require('../controllers/staffOrders.controllers');
const { checkStatus } = require('../helpers/check_status');


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE
//estas son las rutas de lo q puede o no hacer un empleado

router.post('/',[
    // checkTokenStaff,
    requireToken,
    superRole,
    checkFields
    
],userPost); 

router.get('/orders',[
    // checkTokenStaff,
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], getStaffOrders); 


router.post('/',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE"),
    check('status').custom( checkStatus),
    checkFields
    
],createOrder); 

module.exports= router;

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







