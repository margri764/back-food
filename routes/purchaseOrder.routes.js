
const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { createOrder, getOrder, editOrder, getUserOrder, getStaffOrder, getUserHistoryPurchaseOrders } = require('../controllers/purchaseOrder.controllers');
const { getStaffOrders } = require('../controllers/staffOrders.controllers');
const { orderValidator } = require('../helpers/order-validators');
const { checkToken, multiRole, checkFields, requireToken } = require('../middlewares');




router.post('/',[
    requireToken,
    check('order').custom( orderValidator ),
    checkFields
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],createOrder); 

// son las ordenes que recibe el dashboard para editar y demas
router.get('/staffOrder',[
    requireToken,
],getStaffOrder); 

// son las ordenes que recibe el dashboard para "Clientes"
router.get('/getUserHistoryPurchaseOrders/:id',[
    requireToken,
], getUserHistoryPurchaseOrders); 



// son las ordenes q ve el cliente en "ordenes en proceso", la orden de compra NO tiene su finished = true 
router.get('/userOrder',[
    requireToken,
],getUserOrder); 

// router.post('/orderStatus',[
//     requireToken,
//     multiRole('ADMIN_ROLE ','SUPER_ROLE ' ,'STAFF_ROLE '),
// ],editOrder);

// edito el estado de las ordenes



module.exports= router;