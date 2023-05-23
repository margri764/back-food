
const { Router } = require ('express');
const { check } = require ('express-validator');
const { userPost, userPut, userDelete, settingUser, getSettingUser, getUserByToken, getAllUsers, activeUserAccount} = require('../controllers/user.controllers');
const { checkFields, multiRole, requireToken, userRole } = require('../middlewares');
const { isRoleValid, checkEmail, checkId } = require('../helpers/db-validators');
const { sanitizeUserUpdate } = require('../middlewares/sanitize-auth');
const router = Router();

router.patch('/address',[
    requireToken,
    userRole ('SUPER_ROLE'),
    checkFields  
], userPut)

router.patch('/activeUserAccount',[
    requireToken,
    userRole ('SUPER_ROLE', 'ADMIN_ROLE'),
    checkFields  
], activeUserAccount)

router.get('/',[
    requireToken,
], getUserByToken);

router.get('/getAllUser',[
    requireToken,
], getAllUsers);

//el requireToken,proteje esta ruta con los JWT para q no sea publica 
router.delete('/:id',[
    requireToken,
    multiRole ('ADMIN_ROLE','USER_ROLE'),
    check('id','No es un id valido de mongoDB').isMongoId(),
    check('id').custom( checkId ),
    checkFields
], userDelete);

router.post("/setting", [
    requireToken,
    check('typeRequest')
    .exists().withMessage('La propiedad "typeRequest" es obligatorio')
    .isIn(['post', 'put']).withMessage('El valor debe ser "put" o "post"'),
    checkFields  
], settingUser);

router.put("/setting", [
    requireToken,
    check('typeRequest')
    .exists().withMessage('La propiedad "typeRequest" es obligatorio')
    .isIn(['post', 'put']).withMessage('El valor debe ser "put" o "post"'),
    checkFields  
], settingUser);

router.get("/setting", [
    requireToken
], getSettingUser);

router.put('/:id',[
    requireToken,
    sanitizeUserUpdate()
], userPut);

module.exports= router;



