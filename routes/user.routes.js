
const { Router } = require ('express');
const { check } = require ('express-validator');
const { userPost, userPut, getUserById, usersDelete, settingUser, getSettingUser} = require('../controllers/user.controllers');
const { checkFields, multiRole, requireToken, userRole } = require('../middlewares');
const { isRoleValid, checkEmail, checkId } = require('../helpers/db-validators');
const router = Router();



router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','el correo no es valido').isEmail(),
    check('email').custom( checkEmail),
    check('password','El password es obligatorio, mas de 6 letras').isLength({min:6}),
    check('role').custom( isRoleValid),
    checkFields

],userPost);


router.patch('/address',[
    requireToken,
    userRole ('SUPER_ROLE'),
    checkFields  
], userPut)


router.get('/',[
    requireToken,
], getUserById);

//el requireToken,proteje esta ruta con los JWT para q no sea publica 
router.delete('/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','USER_ROLE',''),
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkId ),
    checkFields
], usersDelete);

router.post("/setting", [
    requireToken
], settingUser);

router.put("/setting", [
    requireToken
], settingUser);

router.get("/setting", [
    requireToken
], getSettingUser);

router.put('/:id',[
    requireToken,
], userPut);

module.exports= router;



