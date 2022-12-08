



const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { orderPost } = require('../controllers/purchaseOrder.controllers');
const { statusPurchaseOrderPost} = require('../controllers/statusPurchaseOrder.controllers');
const { checkToken, multiRole, checkTokenStaff } = require('../middlewares');




router.post('/',[
    checkTokenStaff,
    // multiRole ('ADMIN_ROLE','SUPER_ROLE'),
],statusPurchaseOrderPost); 







module.exports= router;