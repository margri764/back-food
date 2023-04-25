

const { Router } = require ('express');
const { getUserSearch,  } = require('../controllers/search.controllers');
const { multiRole, requireToken } = require('../middlewares')

const router = Router();


router.get('/user',[
    requireToken,
    multiRole("SUPER_ROLE","ADMIN_ROLE","STAFF_ROLE")
], getUserSearch);

module.exports= router;