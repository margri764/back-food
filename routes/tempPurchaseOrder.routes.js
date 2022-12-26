




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder, getTempOrder } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { checkToken, multiRole, checkFields,   } = require('../middlewares');
const { drinkValidator, friesValidator } = require('../helpers/product-validators')


// Lee de la request las propiedades drink y fries q son arrays y los manda como parametro 

router.post('/',[
    checkToken,
    check('drink').custom( drinkValidator ),
    // check('fries').custom( friesValidator ),
    checkFields,
],createTempOrder); 

router.get('/',[
    checkToken,
],getTempOrder);





module.exports= router;