




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { checkToken, multiRole } = require('../middlewares');




router.post('/',[
    checkToken,
    check('product').custom( checkProduct),
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],createTempOrder); 







module.exports= router;