

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { createOrder } = require('../controllers/purchaseOrder.controllers');
const { checkToken, multiRole } = require('../middlewares');




router.post('/',[
    checkToken,
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],createOrder); 







module.exports= router;