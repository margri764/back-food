
const { Router } = require ('express');
const {check} = require ('express-validator');
const { userPost, userPut } = require('../controllers/users.controllers');
const router = Router();





router.post('/',[
],userPost);

router.put('/:id',[
],userPut);


module.exports= router;



