
const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { createOrder, getOrder } = require('../controllers/purchaseOrder.controllers');
const { orderValidator } = require('../helpers/order-validators');
const { checkToken, multiRole, checkFields, requireToken } = require('../middlewares');




router.post('/',[
    requireToken,
    check('order').custom( orderValidator ),
    checkFields
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],createOrder); 


router.get('/',[
    requireToken,
],getOrder); 





module.exports= router;