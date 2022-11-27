
const { Router } = require ('express');
const {check} = require ('express-validator');
const { checkEmailRegister } = require('../controllers/emailCheck');
const { userPost, userPut, getUserById } = require('../controllers/users.controllers');
const router = Router();





router.post('/',[
],userPost);

router.get('/checkemail',[
],checkEmailRegister);

router.put('/:id',[
],userPut);

router.get('/:id',[
],getUserById);


module.exports= router;



