

const { Router } = require ('express');
const { check } = require ('express-validator');
const { createProduct, updateProduct, deleteProduct, updateManyPrice, deleteManyProduct, getPausedProduct, pausePlayCategory, pausePlayProductByID, getProduct } = require('../controllers/product.controllers');
const { checkFields, multiRole, requireToken} = require ('../middlewares');
const { checkFileUp } = require('../middlewares/check-file');
const { validCategory, validOperation } = require('../helpers/db-validators.js');
const { checkCategory } = require('../middlewares/check-category');

const router = Router();

// modificar todos los precios por categoria
router.patch('/updateManyPrice/:category',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkCategory,
    check('operation').custom( operation => validOperation(operation, ['SUMAR', 'RESTAR', 'INCREMENTAR %', 'DECREMENTAR %'])),
    checkFields  
], updateManyPrice)


router.patch('/pauseCategory/:category',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkCategory,
    checkFields  
], pausePlayCategory)

router.put('/:category/:id',[
    requireToken,
    multiRole('ADMIN_ROLE','SUPER_ROLE'),
    checkFields  
], updateProduct)

// router.post('/',upload.any(),[ 
router.post('/:category',[ 
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFileUp,
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES', 'OFFER'])),
    checkFields  
], createProduct );


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