const { Router } = require ('express');
const {check} = require ('express-validator');
const { checkFields, requireToken, requireRefreshToken } = require('../middlewares')
const { confirm, signUp, login, phone, loginStaff, refreshToken, logout} = require('../controllers/auth.controllers');
const router = Router();

// ver si necesito mas checks

router.post('/validate-code',[
],confirm); 

router.post('/signup',[
],signUp);

router.post('/signup/phone',[
],phone);

router.post('/login',[
    check('email','el correo no es valido').isEmail(),
    check('password','El password es obligatorio, mas de 6 letras').not().isEmpty(),
    checkFields
],login);



router.post('/loginStaff',[
    check('email','el correo no es valido').isEmail(),
    check('password','El password es obligatorio, mas de 6 letras').not().isEmpty(),
    checkFields
],loginStaff);

// Validar y revalidar token
router.get( '/renewToken',[

    // aca necesito el refreshToken desde Bearer 
    requireRefreshToken
] , refreshToken  );


router.get("/logout", logout);

module.exports= router;