const Usuario = require ('../models/usuario');
// const Role = require ('../models/role');
// const Category = require ('../models/category');
// const Product = require('../models/product');

const checkEmail = async (email) =>{
    
    const emailChecked = await Usuario.findOne({email});
      if(emailChecked){
          throw new Error (`El correo  ${email} ya esta regitrado en DB`);
          }
  }
  
  const checkId = async ( id ) =>{
      
      const idChecked = await Usuario.findById(id);
        if(!idChecked){
            throw new Error (`El id: ${ id } no existe en BD`);
            }
    }