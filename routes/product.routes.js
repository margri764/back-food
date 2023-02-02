

const { Router } = require ('express');
const { check } = require ('express-validator');
const { createProduct, getProductByCategory, updateProduct, deleteProduct, updateManyPrice, deleteManyProduct, pauseProductByID, getPausedProduct, pauseCategory, playPauseCategory } = require('../controllers/product.controllers');
const { checkFields, checkTokenStaff, multiRole, requireToken} = require ('../middlewares');
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

// modificar todos los precios por categoria
router.patch('/pauseCategory/:category',[
    requireToken,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkCategory,
    checkFields  
], pauseCategory)

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
    check('category').custom( category => validCategory(category, ['BURGER', 'PIZZA', 'HEALTHY', 'VEGAN', 'DRINK', 'FRIES'])),
    checkFields  
], createProduct );


// OJO REVISAR SI CHEQUEA TODO BIEN NO LLEVAN TOKEN xq es lo q se tiene q cargar si o si en el inicio de la app
router.get('/',[
], getProductByCategory)

//hay q ver quien tiene acceso..
router.get('/category',[
    requireToken,
    multiRole('ADMIN_ROLE','SUPER_ROLE'),
    checkFields 
], playPauseCategory)


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

// SEGURO Q SE PUEDE HACER DESDE EL FRONT PARA NO AGREGAR ESTE ENDPOINT envio al front el listado de todos los productos q estan pausados
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