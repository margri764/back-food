




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder, getTempOrder, deleteTempOrder, deleteManyTempOrder, delTempOrderIfNoStock } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { requireToken, multiRole, checkFields    } = require('../middlewares');
const { drinkValidator, friesValidator, mainProdValidator } = require('../helpers/product-validators');
const { deleteManyProduct } = require('../controllers/product.controllers');
const { sanitizeTempPurchaseOrder } = require('../middlewares/sanitize-tempPurchaseOrder');


// Lee de la request las propiedades drink y fries q son arrays y los manda como parametro 

router.post('/',[
    requireToken,
    sanitizeTempPurchaseOrder(),
    check('productID').custom( mainProdValidator ),
    check('drink').custom( drinkValidator ),
    check('fries').custom( friesValidator ),
    checkFields,
], createTempOrder); 

router.get('/',[
    requireToken,
], getTempOrder);

router.delete('/:id',[
    requireToken,
    check('id', 'no es un id de Mongo valido').isMongoId(),
],deleteTempOrder);

router.delete('/tempOrderNoStock/deleteMany',[
    requireToken
], delTempOrderIfNoStock);


module.exports= router;