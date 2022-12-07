const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { getOrders} = require('../controllers/order.controllers');



router.get('/',[
],getOrders); 


module.exports= router;