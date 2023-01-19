

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { userPost, createRole } = require('../controllers/staff.controllers');
const { superRole, checkFields, checkTokenStaff,adminRole, multiRole, requireToken } = require('../middlewares')
const { isRoleValid } = require('../helpers/db-validators');
const { getOrder, createOrder, } = require('../controllers/purchaseOrder.controllers');
const { getStaffOrders, editOrderStatus, getStaffOrdersNoProcess, getStaffOrdersByQuery } = require('../controllers/staffOrders.controllers');
const { checkStatus } = require('../helpers/check_status');


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE
//estas son las rutas de lo q puede o no hacer un empleado

router.post('/createStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
    
],userPost); 

router.post('/createAdmin',[
    requireToken,
    superRole,
    checkFields
    
],userPost); 


router.post('/createRole',[
    requireToken,
    superRole,
    checkFields
    
],createRole); 

// obtengo todas las ordenes
router.get('/orders',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], getStaffOrders); 

// obtengo todas las ordenes por query
router.get('/orders/byQuery',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], getStaffOrdersByQuery); 

router.get('/ordersNoProcess',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], getStaffOrdersNoProcess); 


router.put('/orderStatus',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
],editOrderStatus)




// router.post('/',[
//     requireToken,
//     multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE"),
//     check('status').custom( checkStatus),
//     checkFields
    
// ],createOrder); 

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







