const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { confirm, signUp, login, phone} = require('../controllers/auth.controllers');



router.post('/validate-code',[
],confirm); 

router.post('/signup',[
],signUp);

router.post('/signup/phone',[
],phone);

router.post('/login',[
],login);





module.exports= router;