
const { Router } = require ('express');
const {check, param} = require ('express-validator');
const router = Router();
const { createOrder, getUserOrder, getUserHistoryPurchaseOrders } = require('../controllers/purchaseOrder.controllers');
const { orderValidator } = require('../helpers/order-validators');
const { checkFields, requireToken } = require('../middlewares');
const { sanitizePurchaseOrder } = require('../middlewares/sanitize-purchaseOrders');


router.post('/',[
    requireToken,
    sanitizePurchaseOrder(),
    check('order').custom( orderValidator ),
    checkFields
], createOrder); 


// son las ordenes que recibe el dashboard para "Clientes"
router.get('/getUserHistoryPurchaseOrders/:id',[
    requireToken,
    param('id').trim().escape().isAlpha(),
], getUserHistoryPurchaseOrders); 


// son las ordenes q ve el cliente en "ordenes en proceso", la orden de compra NO tiene su finished = true 
router.get('/userOrder',[
    requireToken,
],getUserOrder); 


module.exports= router;