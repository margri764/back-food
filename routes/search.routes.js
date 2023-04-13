

const { Router } = require ('express');
const { getProductSearch, getUserSearch, getOrderSearch } = require('../controllers/search.controllers');
const { superRole, checkFields, checkTokenStaff,adminRole, multiRole, requireToken } = require('../middlewares')

const router = Router();


router.get('/',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE")
], getProductSearch);

router.get('/user',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE")
], getUserSearch);

router.get('/purchaseOrder',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE")
], getOrderSearch);


module.exports= router;