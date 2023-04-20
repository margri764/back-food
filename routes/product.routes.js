const { Router } = require ('express');
const { check, param } = require ('express-validator');
const { createProduct, updateProduct, deleteProduct, updateManyPrice, deleteManyProduct, pausePlayCategory, pausePlayProductByID, getProduct } = require('../controllers/product.controllers');
const { checkFields, multiRole, requireToken} = require ('../middlewares');
const { checkFileUp } = require('../middlewares/check-file');
const { validCategory, validOperation } = require('../helpers/db-validators.js');
const { checkCategory } = require('../middlewares/check-category');
const { sanitizeProductBody, sanitizeProductBodyUpdate, sanitizeOperation } = require('../middlewares/sanitize-body-products');

const router = Router();

router.post('/:category',[ 
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    param('category').trim().escape().isAlpha(),
    sanitizeProductBody(),
    checkFileUp,
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES', 'OFFER'])),
    checkFields  
], createProduct );

router.put('/:category/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    param('category').trim().escape().isAlpha(),
    param('id').trim().escape().isMongoId(),
    sanitizeProductBodyUpdate(),
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES', 'OFFER'])),
    multiRole('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], updateProduct)

// modificar todos los precios por categoria
router.patch('/updateManyPrice/:category',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    param('category').trim().escape().isAlpha(),
    sanitizeOperation(),
    check('operation').custom( operation => validOperation(operation, ['SUMAR', 'RESTAR', 'INCREMENTAR %', 'DECREMENTAR %'])),
    checkCategory,
    checkFields  
], updateManyPrice)

router.patch('/pauseCategory/:category',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    check('id').trim().escape().isMongoId(),
    param('category').trim().escape().isAlpha(),
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES', 'OFFER'])),
    checkCategory,
    checkFields  
], pausePlayCategory)





// OJO REVISAR SI CHEQUEA TODO BIEN NO LLEVAN TOKEN xq es lo q se tiene q cargar si o si en el inicio de la app
router.get('/',[
], getProduct)


// los STAFF solo deberian poder pausar un producto, oferta, etc
router.patch('/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], deleteProduct)

// DEBERIAN TENER EL MIDDLEWARE ¿ES MONGO ID?
router.patch('/noStock/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE', 'STAFF_ROLE'),
    checkFields  
], pausePlayProductByID)


// los STAFF solo deberian poder pausar un producto, oferta, etc
router.delete('/deleteToMany/:categoryId',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], deleteManyProduct)







module.exports= router;