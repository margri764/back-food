

const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { orderPost } = require('../controllers/purchaseOrders.controllers');




router.post('/:id',[
],orderPost); 







module.exports= router;