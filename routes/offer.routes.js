


const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { superRole, checkFields, checkTokenStaff,adminRole, multiRole, requireToken } = require('../middlewares')
const { getStaffOrders, editOrderStatus, getStaffOrdersByQuery } = require('../controllers/staffOrders.controllers');
const { getStaffProducts } = require('../controllers/product.controllers');


router.post('/createStaff',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE"),
    checkFields
    
],userPost); 






module.exports= router;


