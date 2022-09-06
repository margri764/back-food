
const { Router } = require ('express');
const {check} = require ('express-validator');
const { checkEmail } = require('../controllers/emailCheck');
const { userPost, userPut } = require('../controllers/users.controllers');
const router = Router();





router.post('/',[
],userPost);

router.get('/checkemail',[
],checkEmail);

router.put('/:id',[
],userPut);


module.exports= router;



