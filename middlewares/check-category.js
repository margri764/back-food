

const Category = require('../models/category') 


const checkCategory = async ( req, res, next )=>{

  const { category }= req.params;

  const validCat = await Category.findOne({ name : category.toUpperCase() } ) || null; //busca el id en la BD 

  if(validCat == null){
    return res.status(400).json({
      success : false,
      msj : "La categoria ingresada no existe en Base de Datos"
    })
  }
  
  // esto esta xq sino me da error al intentar poner "play" a una Categoría o Producto
  const { playOrPause } = req.body; 

  if(playOrPause == undefined){
     if(!validCat.state){
       return res.status(400).json({
         success : false,
         msj : "La categoria ingresada se encuentra eliminada o pausada de Base de Datos"
       })
     }
 }

  req.validCat = {categoryId :validCat._id, name: validCat.name};

next();
}

module.exports = {
                checkCategory
                 }