

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { orderPost } = require('../controllers/purchaseOrder.controllers');
const { checkToken } = require('../middlewares');




router.post('/',[
    checkToken
],orderPost); 







module.exports= router;