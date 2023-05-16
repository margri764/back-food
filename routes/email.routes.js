const { Router } = require ('express');
const router = Router();

const { emailFeint } = require('../controllers/email-hostinger-feint');
const { emailRevimack } = require('../controllers/email-hostinger-revimack');



router.post('/feint',[
],emailFeint); 

router.post('/revimack',[
],emailRevimack); 

// router.post('/revimack/data',[
// ], capture); 






module.exports= router;