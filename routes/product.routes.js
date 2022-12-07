

const { Router } = require ('express');
const {check} = require ('express-validator');
const { postProduct } = require('../controllers/product.controllers');
const router = Router();




router.post('/:id',[
],postProduct); 







module.exports= router;