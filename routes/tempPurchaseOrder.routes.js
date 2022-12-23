




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { checkToken, multiRole, checkFields,   } = require('../middlewares');
const { drinkValidator, friesValidator } = require('../helpers/product-validators')




router.post('/',[
    checkToken,
    check('drink').custom( drinkValidator ),
    check('fries').custom( friesValidator ),
    checkFields,
],createTempOrder); 







module.exports= router;