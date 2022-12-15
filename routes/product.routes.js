

const { Router } = require ('express');
const {check} = require ('express-validator');
const { createProduct, getProductById, getProduct } = require('../controllers/product.controllers');
const { checkFields, checkTokenStaff, multiRole} = require ('../middlewares');
const { checkCategory  } = require('../helpers/db-validators');
const { checkFileUp } = require('../middlewares/check-file');
const router = Router();
// const multer = require('multer');
// const upload = multer();




// router.post('/',upload.any(),[ 
router.post('/',[ 

    checkTokenStaff,
    multiRole ('ADMIN_ROLE','SUPER_ROLE'),
    checkFileUp,
    // check('name','el nombre es obligatorio').not().isEmpty(),
    // check('category','no es un id de Mongo valido').isMongoId(),
   
    // check('category').custom( checkCategory),
    checkFields  
], createProduct );

router.get('/:id',[

],getProductById)

router.get('/',[

],getProduct)


module.exports= router;