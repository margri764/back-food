



const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { orderPost } = require('../controllers/purchaseOrder.controllers');
const { purchaseOrderStatusPost} = require('../controllers/purchaseOrderStatus.controllers');
const { checkToken, multiRole, checkTokenStaff } = require('../middlewares');




router.post('/',[
    checkTokenStaff,
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],purchaseOrderStatusPost); 







module.exports= router;