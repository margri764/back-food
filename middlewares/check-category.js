

const Category = require('../models/category') 


const checkCategoryById = async ( req, res, next )=>{


const { categoryId } = req.params;

    
  const validCat = await Category.findById( categoryId ) || null; //busca el id en la BD 

  if(validCat == null){
    return res.status(400).json({
      success : false,
      msj : "La categoria ingresada no existe en Base de Datos"
    })
  }

  if(!validCat.state){
    return res.status(400).json({
      success : false,
      msj : "La categoria ingresada se encuentra eliminada o pausada de Base de Datos"
    })
  }

next();
}

module.exports = {
                  checkCategoryById
                 }