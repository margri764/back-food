

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { postProduct } = require('../controllers/product.controllers');




router.post('/:id',[
],postProduct); 







module.exports= router;