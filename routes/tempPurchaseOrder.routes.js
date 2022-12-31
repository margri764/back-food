




const { Router } = require ('express');
const {check} = require ('express-validator');
const { createTempOrder, getTempOrder, tempOrderDelete, tempOrderEdit } = require('../controllers/tempPurchaseOrder.controllers');
const checkProduct = require('../helpers/check-product');
const router = Router();
const { requireToken, multiRole, checkFields    } = require('../middlewares');
const { drinkValidator, friesValidator } = require('../helpers/product-validators')


// Lee de la request las propiedades drink y fries q son arrays y los manda como parametro 

router.post('/',[
    requireToken,
    check('drink').custom( drinkValidator ),
    // check('fries').custom( friesValidator ),
    checkFields,
],createTempOrder); 

router.get('/',[
    requireToken,
],getTempOrder);

router.delete('/:id',[
    requireToken,
],tempOrderDelete);

router.put('/',[
    requireToken,
],tempOrderEdit);





module.exports= router;