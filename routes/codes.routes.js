
const { Router } = require ('express');
const router = Router();

const { postCodes, confirmQr } = require('../controllers/codes.controllers');


router.get('/validate-qr/:codeQR',[
],confirmQr); 

router.post('/uploadCodes',[
],postCodes);


module.exports= router;

