
const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { createOrder, getUserOrder, getStaffOrder, getUserHistoryPurchaseOrders } = require('../controllers/purchaseOrder.controllers');
const { orderValidator } = require('../helpers/order-validators');
const { checkFields, requireToken } = require('../middlewares');
const { sanitizePurchaseOrder } = require('../middlewares/sanitize-purchaseOrders');


router.post('/',[
    requireToken,
    sanitizePurchaseOrder(),
    check('order').custom( orderValidator ),
    checkFields
], createOrder); 

// son las ordenes que recibe el dashboard para editar y demas
router.get('/staffOrder',[
    requireToken,
], getStaffOrder); 

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