const { Router } = require ('express');
const {check} = require ('express-validator');
const { checkFields, requireRefreshToken, requireToken } = require('../middlewares')
const { confirm, signUp, login, phone, refreshToken, logout, emailToAsyncValidatorLogin, emailToAsyncValidatorRegister, resetPassword, generateTokenToPassword} = require('../controllers/auth.controllers');
const { checkUserEmail } = require('../helpers/check_user_type');
const router = Router();

// ver si necesito mas checks

router.post('/validate-code',[
],confirm); 

router.post('/signup',[
],signUp);

router.post('/restorePassword',[
    check('email','el correo no es valido').isEmail(),
    check('email').custom( checkUserEmail),
], generateTokenToPassword); 

router.post('/resetPassword',[
    check('email','el correo no es valido').isEmail(),
    check('email').custom( checkUserEmail),
], resetPassword); 


router.post('/signup/phone',[
 requireToken
], phone);

router.post('/login',[
    check('email','el correo no es valido').isEmail(),
    // check('email').custom( checkUserEmail),
    check('password','El password es obligatorio, mas de 6 letras').not().isEmpty(),
    checkFields
], login);

//para valdiacion asyncrona formulario reactivo
router.get('/emailSyncLogin',[
], emailToAsyncValidatorLogin);

//para valdiacion asyncrona formulario reactivo
router.get('/emailSyncRegister',[
], emailToAsyncValidatorRegister);

// Validar y revalidar token
router.get('/renewToken',[
    // aca necesito el refreshToken desde Bearer 
    requireRefreshToken
] , refreshToken  );

router.get("/logout", logout);






module.exports= router;