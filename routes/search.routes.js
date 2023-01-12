

const { Router } = require ('express');
const { getProductSearch } = require('../controllers/search.controllers');
const { superRole, checkFields, checkTokenStaff,adminRole, multiRole, requireToken } = require('../middlewares')

const router = Router();


router.get('/',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE")
], getProductSearch);



module.exports= router;