

const { Router } = require ('express');
const {check} = require ('express-validator');
const { createProduct } = require('../controllers/product.controllers');
const { checkFields, checkToken } = require ('../middlewares');
const { checkCategory } = require('../helpers/db-validators')
const router = Router();



router.post('/',[ 

    // checkToken,
    // check('name','el nombre es obligatorio').not().isEmpty(),
    // check('category','no es un id de Mongo valido').isMongoId(),
    // check('category').custom( checkCategory),
    // checkFields  
], createProduct );




module.exports= router;