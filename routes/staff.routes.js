

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { createRole, pausePlayApp, getAppState, createHourlyRate, updateHourlyRateById, deleteHourlyRateById, getStaff, createStaff, staffUpdate, deleteStaff, pausePlayStaffById } = require('../controllers/staff.controllers');
const { superRole, checkFields, multiRole, requireToken } = require('../middlewares')
const { isStaffRoleValid, checkIdStaff } = require('../helpers/db-validators');
const { getStaffOrders, editOrderStatus, getStaffOrdersByQuery } = require('../controllers/staffOrders.controllers');
const { getStaffProducts } = require('../controllers/product.controllers');


// para crear un empleado tiene q ser un usuario SUPER_ROLE 
//para crear productos, categorias, editar todo eso con ADMIN_ROLE
//estas son las rutas de lo q puede o no hacer un empleado

router.post('/createStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    check('role').custom( role => isStaffRoleValid(role)),
    checkFields
    
],createStaff); 

router.get('/getStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
],getStaff); 

router.put('/editStaff/:id',[
    requireToken,
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkIdStaff ),
    check('role').custom( isStaffRoleValid ),
    checkFields
], staffUpdate);

router.patch('/deleteStaff/:id',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('role').custom( isStaffRoleValid ),
    checkFields
], deleteStaff);

router.patch('/pausePlayStaff/:id',[
    requireToken,
    check('id','No es un id valido de mongoDB').isMongoId(),
    multiRole ('ADMIN_ROLE','SUPER_ROLE', 'STAFF_ROLE'),
    checkFields  
], pausePlayStaffById)

// router.post('/createAdmin',[
//     requireToken,
//     superRole,
//     checkFields
    
// ],userPost); 


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









