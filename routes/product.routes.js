

const { Router } = require ('express');
const { check } = require ('express-validator');
const { createProduct, getProductByCategory, updateProduct, deleteProduct, updateManyPrice, deleteManyProduct, pauseProductByID, getPausedProduct } = require('../controllers/product.controllers');
const { checkFields, checkTokenStaff, multiRole, requireToken} = require ('../middlewares');
const { checkFileUp } = require('../middlewares/check-file');
const { validCategory, validOperation } = require('../helpers/db-validators.js');
const { checkCategoryById } = require('../middlewares/check-category');

const router = Router();

// modificar todos los precios por categoria
router.patch('/:updateManyPrice/:categoryId',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkCategoryById,
    check('operation').custom( operation => validOperation(operation, ['SUMAR', 'RESTAR', 'INCREMENTAR %', 'DECREMENTAR %'])),
    checkFields  
], updateManyPrice)

router.put('/:category/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], updateProduct)

// router.post('/',upload.any(),[ 
router.post('/:category',[ 
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFileUp,
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES'])),
    checkFields  
], createProduct );


//no lleva middlewares xq es lo q se tiene q cargar si o si en el inicio de la app
router.get('/',[
], getProductByCategory)


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
], pauseProductByID)

// envio al front el listado de todos los productos q estan pausados
router.get('/noStock',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE','STAFF_ROLE'),
    checkFields  
], getPausedProduct)

// los STAFF solo deberian poder pausar un producto, oferta, etc
router.delete('/deleteToMany/:categoryId',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], deleteManyProduct)







module.exports= router;