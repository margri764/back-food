
const { Router } = require ('express');
const {check} = require ('express-validator');
const { userPost, userPut, getUserById, usersDelete} = require('../controllers/user.controllers');
const { checkEmailRegister } = require ('../controllers/emailCheck')
const { checkFields, multiRole } = require('../middlewares');
const { isRoleValid, checkEmail, checkId } = require('../helpers/db-validators');
const role = require('../models/role');
const router = Router();





router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','el correo no es valido').isEmail(),
    check('email').custom( checkEmail),
    check('password','El password es obligatorio, mas de 6 letras').isLength({min:6}),
    check('role').custom( isRoleValid),
    checkFields

],userPost);

router.get('/checkemail',[
],checkEmailRegister);

router.put('/:id',[
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkId ),
    check('role').custom( isRoleValid),
    checkFields
],userPut);

router.get('/:id',[
],getUserById);

router.delete('/:id',
[
    // checkToken,
    multiRole ('ADMIN_ROLE','USER_ROLE',''),
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkId ),
    checkFields
], usersDelete);


module.exports= router;



