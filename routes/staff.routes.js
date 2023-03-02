

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { userPost, createRole, pausePlayApp, getAppState, createHourlyRate, updateHourlyRateById, deleteHourlyRateById, getStaff } = require('../controllers/staff.controllers');
const { superRole, checkFields, checkTokenStaff,adminRole, multiRole, requireToken } = require('../middlewares')
const { isRoleValid } = require('../helpers/db-validators');
const { getOrder, createOrder, } = require('../controllers/purchaseOrder.controllers');
const { getStaffOrders, editOrderStatus, getStaffOrdersNoProcess, getStaffOrdersByQuery } = require('../controllers/staffOrders.controllers');
const { checkStatus } = require('../helpers/check_status');
const { getStaffProducts } = require('../controllers/product.controllers');


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE
//estas son las rutas de lo q puede o no hacer un empleado

router.post('/createStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
    
],userPost); 

router.get('/getStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
],getStaff); 

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

// quiero REFORMAR!!!
// router.get('/ordersNoProcess',[
//     requireToken,
//     multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
//     checkFields
// ], getStaffOrdersNoProcess); 

// son los productos q se editan en el dashboard
router.get('/product',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], getStaffProducts); 

// no lleva token xq es lo q primero hace la app
router.get('/appState',[
], getAppState); 


router.put('/orderStatus',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
],editOrderStatus)

router.post('/pausePlayApp',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
],pausePlayApp)

router.patch('/hourlyRate',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], createHourlyRate)

router.patch('/hourlyRate/:id',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    check('id','No es un id valido de mongoDB').isMongoId(),
    checkFields
], updateHourlyRateById)

router.delete('/hourlyRate/:id',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    check('id','No es un id valido de mongoDB').isMongoId(),
    checkFields
], deleteHourlyRateById)




module.exports= router;









