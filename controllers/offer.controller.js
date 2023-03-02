



const {response} = require ('express');
const bcryptjs = require ('bcryptjs');
const User = require ('../models/user');
const Staff  = require ('../models/staff');
const Role  = require ('../models/role');
const App  = require ('../models/appState');
const { checkHourly } = require('../helpers/check-hourly');



const createOffer= async (req, res = response) => {
    
    const { category }  = req.params;
    
    const user = req.userAuth;

    // recibo el string del form-data body y lo parseo
    let { postProduct } = req.body;
    postProduct= JSON.parse(postProduct);
 
   let { name, ...rest } = postProduct; 

   
   //busco si el producto ya esta creado lo q puedo usar es el nombre
   let product =        await Product.findOne({name : name}) || null;
   const prodCategory = await Category.findOne({name : category.toUpperCase()},{state : true}) || null;
   const staff =        await Staff.findById(user._id) || null;
   
    if( !prodCategory){
      return res.status(400).json({
          success: false,
          msg: `No se encuentra la categoria ${prodCategory}`
      })
  }

    if( staff == null){
        return res.status(400).json({
            success: false,
            msg: 'No se encuentra Empleado'
        })
    }

    if( staff.stateAccount == false){
        return res.status(400).json({
            success: false,
            msg: 'Empleado eliminado o suspendido, hable con encargado'
         })
    }
    

    if( product != null){
        return res.status(400).json({
            success: false,
            msg: 'Producto ya cargado'
        })
    }

    const { tempFilePath } = req.files.file;

    const {secure_url} = await cloudinary.uploader.upload( tempFilePath, {folder: `FoodApp/${category.toUpperCase()}`});
    
    const tempProduct = {
        ...rest,
           staff : staff._id,
           name,
           img: secure_url,
           category: prodCategory._id
    }

    product =  new Product (tempProduct);

    product.save()

    res.status(200).json({
        success: true,
        product,
    })
}

module.exports = {  
                   createOffer
                 }