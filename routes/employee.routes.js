



const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();
const { userPost } = require('../controllers/employee.controllers');




router.post('/',[
],userPost); 







module.exports= router;