const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { confirm, signUp, login} = require('../controllers/auth.controllers');



router.post('/validate-code',[
],confirm); 

router.post('/signup',[
],signUp);

router.post('/login',[
],login);




module.exports= router;