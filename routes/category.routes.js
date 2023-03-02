 
 const { Router } = require ('express');

 const { check } = require ('express-validator');
 const { createCategory,  getCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controllers');
 const { checkCategory} = require ('../helpers/db-validators');
 
 const router = Router();
 
 
//  const { checkToken } = require ('../middlewares/check-jwt');
 const { adminRole, checkFields, checkTokenStaff, multiRole, requireToken, } = require('../middlewares');

 
 
 //obtener todas las categorias - publico
 router.get('/', getCategory);
 
 //obtener una categoria por id - publico
 router.get('/:id',[
 
     check('id', 'no es un id de Mongo valido').isMongoId(),
     check('id').custom( checkCategory),
     checkFields,
 ],getCategoryById);
 
 
 
 //crear una categoria  

 router.post('/',[ 
     requireToken,
     multiRole('ADMIN_ROLE','SUPER_ROLE'),
     check('name','el nombre es obligatorio').not().isEmpty(),
     checkFields  
 
 ],createCategory );
 
 
 //actualizar una categoria - privado cualquier persona con token valido
 router.put('/:id',[
     requireToken,
     check('name','el nombre es obligatorio').not().isEmpty(),
     check('id').custom( checkCategory),
     checkFields
 ],updateCategory);
 
 //Borrar una categoria - privado solos si tiene role "ADMIN"
 router.delete('/:id',[
     requireToken,
     adminRole,
     check('id', 'no es un id de Mongo valido').isMongoId(),
     check('id').custom( checkCategory),
     checkFields,
 ],deleteCategory);
 
 
 
 module.exports= router;