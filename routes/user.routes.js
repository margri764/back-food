
const { Router } = require ('express');
const { check } = require ('express-validator');
const { userPut, settingUser, getSettingUser, getUserByToken, getAllUsers, activeUserAccount} = require('../controllers/user.controllers');
const { checkFields, requireToken, userRole } = require('../middlewares');
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



