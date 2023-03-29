




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder, getTempOrder, deleteTempOrder, tempOrderEdit, deleteManyTempOrder, delTempOrderIfNoStock } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { requireToken, multiRole, checkFields    } = require('../middlewares');
const { drinkValidator, friesValidator, mainProdValidator } = require('../helpers/product-validators');
const { deleteManyProduct } = require('../controllers/product.controllers');


// Lee de la request las propiedades drink y fries q son arrays y los manda como parametro 

router.post('/',[
    requireToken,
    check('productID').custom( mainProdValidator ),
    check('drink').custom( drinkValidator ),
    check('fries').custom( friesValidator ),
    checkFields,
], createTempOrder); 

router.get('/',[
    requireToken,
],getTempOrder);

router.delete('/:id',[
    requireToken
],deleteTempOrder);

router.delete('/tempOrderNoStock/deleteMany',[
    requireToken
], delTempOrderIfNoStock);

router.put('/',[
    requireToken,
],tempOrderEdit);

router.delete('/',[
    requireToken,
],deleteManyTempOrder);





module.exports= router;