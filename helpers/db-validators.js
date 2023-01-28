

const Role = require ('../models/role');
const User = require ('../models/user');
const Category = require ('../models/category');
const Product = require('../models/product');


const isRoleValid = async (role='USER_ROLE') => {
    const checkRol = await Role.findOne({role});
    if(!checkRol){
        throw new Error (`el role ${role} no esta regitrado en DB`)
    }
}

const checkEmail = async (email) =>{
    
  const emailChecked = await User.findOne({email});
    if(emailChecked){
        throw new Error (`El correo  ${email} ya esta regitrado en DB`);
        }
}

const checkId = async ( id ) =>{
    
    const idChecked = await User.findById(id);
      if(!idChecked){
          throw new Error (`El id: ${ id } no existe en BD`);
          }
  }

  const checkCategory = async ( id ) =>{
    
    const existsCategory = await Category.findById(id);
      if(!existsCategory){
          throw new Error (`El id: ${ id } no existe en BD`);
          }
  }

  const checkProduct = async ( id ) =>{
    
    const existsProduct = await Product.findById(id);
      if(!existsProduct){
          throw new Error (`El id: ${ id } no existe en BD`);
          }
  }

   const validCategory =  ( category='', categories=[] ) => {

    category = category.toUpperCase();
     const validCategory = categories.includes(category);
     
      if( !validCategory ){

        throw new Error (`la categoría ${category} no existe en Base de Datos, solo ${categories}`)
      }
      return true;

   } 

   const validOperation =  ( operation='', arrOperation = [] ) => {

      operation = operation.toUpperCase();
     const validOperation = arrOperation.includes(operation);
     
      if( !validOperation ){

        throw new Error (`la operacion ${operation} no existe en Base de Datos, solo ${arrOperation}`)
      }
      return true;

   } 

module.exports={
    isRoleValid,
    checkEmail,
    checkId,
    checkCategory,
    checkProduct,
    validCategory,
    validOperation


}