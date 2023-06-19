const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { createRole, pausePlayApp, getAppState, createHourlyRate, updateHourlyRateById, deleteHourlyRateById, getStaff, createStaff, staffUpdate, deleteStaff, pausePlayStaffById, updateCustomMsg, createApp } = require('../controllers/staff.controllers');
const { superRole, checkFields, multiRole, requireToken } = require('../middlewares')
const { isStaffRoleValid, checkIdStaff, checkId } = require('../helpers/db-validators');
const { getStaffOrders, editOrderStatus, getStaffOrdersByQuery } = require('../controllers/staffOrders.controllers');
const { sanitizeStaff, sanitizeUpdateStaff } = require('../middlewares/sanitize-staff');
const { sanitizeHourlyApp } = require('../middlewares/sanitize-app');
const { userDelete } = require('../controllers/user.controllers');




router.post('/createApp',[
    requireToken,
    multiRole("SUPER_ROLE"),
    check('role').custom( role => isStaffRoleValid(role)),
    checkFields
], createApp); 

router.post('/createStaff',[
    requireToken,
    sanitizeStaff(),
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    check('role').custom( role => isStaffRoleValid(role)),
    checkFields
], createStaff); 

router.patch('/updateCustomMsg', [
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
], updateCustomMsg);

router.get('/getStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
], getStaff); 

router.put('/editStaff/:id',[
    requireToken,
    sanitizeUpdateStaff(), 
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
    check('pauseOrPlay')
    .exists().withMessage('El query pauseOrPlay es obligatorio')
    .isIn(['pause', 'play']).withMessage('El valor debe ser "pause" o "play"'),
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], pausePlayStaffById)

router.post('/createRole',[
    requireToken,
    superRole,
    checkFields
], createRole); 

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

// no lleva token xq es lo q primero hace la app
router.get('/appState',[
], getAppState); 

router.put('/orderStatus',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    checkFields
], editOrderStatus)

router.post('/pausePlayApp',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    sanitizeHourlyApp(),
    checkFields
], pausePlayApp)

router.patch('/hourlyRate',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    sanitizeHourlyApp(),
    checkFields
], createHourlyRate)

router.patch('/hourlyRate/:id',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    check('id','No es un id valido de mongoDB').isMongoId(),
    sanitizeHourlyApp(),
    checkFields
], updateHourlyRateById)

router.delete('/hourlyRate/:id',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE", "STAFF_ROLE"),
    check('id','No es un id valido de mongoDB').isMongoId(),
    checkFields
], deleteHourlyRateById)


router.delete('/:id',[
    requireToken,
    multiRole ('SUPER_ROLE',' ADMIN_ROLE'),
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkId ),
    checkFields
], userDelete);


module.exports= router;









