

const { Router } = require ('express');
const { check } = require ('express-validator');
const { createProduct, getProductById, getProduct, getProductByCategory, updateProduct } = require('../controllers/product.controllers');
const { checkFields, checkTokenStaff, multiRole} = require ('../middlewares');
const { checkFileUp } = require('../middlewares/check-file');
const { validCategory } = require('../helpers/db-validators.js');

const router = Router();





// router.post('/',upload.any(),[ 
router.post('/:category',[ 

    checkTokenStaff,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFileUp,
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES'])),
    checkFields  
], createProduct );

router.get('/:id',[

],getProductById)

router.get('/',[

],getProductByCategory)

router.put('/:category/:id',[
    checkTokenStaff,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES'])),
    checkFields  

],updateProduct)


module.exports= router;