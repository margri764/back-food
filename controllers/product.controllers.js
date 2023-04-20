const Product = require('../models/product');
const Category = require('../models/category');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const { validExtension } = require('../helpers/upload-file');
const { checkValue } = require('../helpers/value-percent');
const validatePrice = require('../helpers/validate-price');


const cloudinary= require ('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);


const createProduct =  async (req, res) => {
  
  const { category }  = req.params;

    const staff = req.userAuth;

    // (recibo el string del form-data body y lo parseo) eso era antes pero estoy parsenado en el sanitize-body-products.js
    const  postProduct  = req.body;
 
   const{ name, ...rest } = postProduct; 

   try {
   
   /* busco el nombre del producto para q no crear dos veces el mismo PERO tiene q estar con status:true o sea q si existe el nombre pero
   se encuentra "eliminado" de BD se puede volver a cargar */ 
   let product = await Product.findOne({name : name, status: true}) || null; 
   const prodCategory = await Category.findOne({name : category.toUpperCase()}, {state : true}) || null;

   if( product != null){
    return res.status(400).json({
        success: false,
        msg: 'Producto ya cargado'
    })
   }
   
    if( !prodCategory){
      return res.status(400).json({
          success: false,
          msg: `No se encuentra la categoria ${prodCategory}`
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

  } catch (error) {

    console.log('error desde createProduct: ', error);
    let errorMessage = "Oops algo salio mal al intentar crear un producto"
    if(error.message.includes("La categoría ")){
      errorMessage = error.message;
    }
    return res.status(500).json({
      success: false,
      msg: errorMessage
    })
    
  }

}

const getProduct= async (req, res) => {

const categoryNames = ["BURGER", "PIZZA", "HEALTHY", "VEGAN", "DRINK", "FRIES", "OFFER"];
const categories = {};

try {

  for (const categoryName of categoryNames) {
    const category = await Category.findOne({ name: categoryName });
    if (category ) {
      const products = await Product.find({ status: true, category: category._id }).populate("category", "name state paused");
      categories[categoryName] = products;
    } 
    else {
      categories[categoryName] = [];
    }
  }

res.status(200).json({
  burger: categories.BURGER,
  pizza: categories.PIZZA,
  healthy: categories.HEALTHY,
  vegan: categories.VEGAN,
  drink: categories.DRINK,
  fries: categories.FRIES,
  offer: categories.OFFER
});

} catch (error) {
  console.log("error desde getProduct: ", error);
  let errorMessage = 'Ups algo salió mal añ intentar obtener los productos';

  return res.status(500).json({
      success: false,
      msg: errorMessage
  });
}
}

const updateProduct = async ( req, res) => {

try {

  const { category, id } = req.params;

  let productEdit = await Product.findById( id.trim()); 

  if (!productEdit){
    return res.status(400).json ({
      msg: `no existe un producto con el id ${ _id }`
    });
  }

  const { stockQuantity, ...rest}  = req.body;

  const validationResult = validatePrice(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
    });
  }

    let secure_URL = null;

    // puede ser q sea un edit pero sin cambiar la img
    if(req.files !== null){

    const { tempFilePath } = req.files.img;
    // // si la extension no es válida no se ejecuta mas, el metodo validExtensaion se encarga de contestar
    await validExtension(req.files.img, res);
      
      //obtengo la img actual desde la BD
      const nameArr = productEdit.img.split('/');
      const name = nameArr [ nameArr.length - 1 ];
      const [ public_id] = name.split('.');
      console.log(public_id);
      cloudinary.uploader.destroy( `FoodApp/${category}/${public_id}`);

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder: `FoodApp/${category}`});
    secure_URL = secure_url
  }

  let tempProduct = {};

  tempProduct = {
      img : secure_URL ? secure_URL : tempProduct.img ,
      ...rest
  }

  if(stockQuantity > 0){
    tempProduct.stock = true;
  }else{
    tempProduct.stock = false;
  }

    
    const product= await Product.findByIdAndUpdate( productEdit._id, tempProduct,{new:true}).populate("category", "name state");


    res.json( {
      success: true,  
      product
    } );

} catch (error) {
  console.log('error desde updateProduct: ', error);

  return res.status(500).json({
    success: false,
    msg: "Oops algo salió mal al intentar editar un producto"
  })
}


}

const updateManyPrice = async (req, res) => {

  try {
    const { categoryId, name } = req.validCat;
    
    // Verificar si la categoría existe en la base de datos
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        msg: `No se encontró la categoría con id ${categoryId}`
      });
    }

    const { value, operation } = req.body;

    if (isNaN(value)) {
      return res.status(400).json({
        success: false,
        msg: `${value} no es un número válido`
      });
    }

    if (value <= 0) {
      return res.status(400).json({
        success: false,
        msg: `El valor debe ser mayor a cero`
      });
    }

    let priceUpdate;

    if (operation.toUpperCase() === "SUMAR") {
      priceUpdate = { $inc: { price: value } };
    } else if (operation.toUpperCase() === "RESTAR") {
      priceUpdate = { $inc: { price: -value } };
    } else if (operation.toUpperCase() === "INCREMENTAR %") {
      const pricePercent = checkValue(value);
      priceUpdate = { $mul: { price: pricePercent } };
    } else if (operation.toUpperCase() === "DECREMENTAR %") {
      if (value < 1 || value >= 100) {
        return res.status(400).json({
          success: false,
          msg: `El valor debe ser un porcentaje válido entre 1 y 99`
        });
      }
      const pricePercent = 1 - value / 100;
      priceUpdate = { $mul: { price: pricePercent } };
    } else {
      return res.status(400).json({
        success: false,
        msg: `Operación inválida: ${operation}`
      });
    }

    const result = await Product.updateMany(
      { category: categoryId },
      priceUpdate,
      { multi: true }
    );

    res.json({
      success: true,
      msg: `Se modificaron ${result.modifiedCount} producto(s) de la categoría ${name}`
    });
  } catch (error) {
    console.log('Error desde updateToMany:', error);
    res.status(500).json({
      success: false,
      msg: "Oops, algo salió mal al intentar editar un producto"
    });
  }
};

const deleteProduct = async (req, res) => {
 
// los productos los elimino de base de datos y la img de cloudinary
  try {
  
    const { id } = req.params;
    const { ...rest } = req.body;

    let product = await Product.findOne({ _id : id });
    // console.log('product: ', product);  

    if(!product) {
      return res.status(400).json({ 
        success: false,
        msg: "Producto no encontrado",      
      });
    }

    if(!product.status) {
      return res.status(400).json({ 
        success: false,
        msg: "El producto que intenta eliminar ya esta dado de baja de la Base de Datos",      
      });
    }

    // busca si el producto q quiere eliminar esta en una orden temporal, puede estar en cualquiera de las colecciones de productos PERO ademas tiene q cumplir con la condicion de q este "INCOMPLETE"
    const existInTempOrder = await TempPurchaseOrder.find({
      $or:[
               { "fries._id"   :  product._id }, 
               { "drink._id"   :  product._id }, 
               { "product._id" :  product._id }, 
          ],
      $and : [ 
              { statusOrder : "INCOMPLETE"}
            ]    
    })


    if(existInTempOrder.length != 0 ) {
      return res.status(400).json({ 
        success: false,
        msg: "No se puede eliminar el producto, existen ordenes temporales de clientes que contienen estos productos, los mismos se eliminan automaticamente cada 12 o 24 hs dependiendo de las reglas de negocio",
      });
    }

    // console.log('si no esta el producto o si se cumple la doble condicion de arriba no tiene q llegar aca ');
    // busco el nombre de la categoria para enviarlo como nombre de carpeta a Cloudinary
  
    // const category = await Category.findOne({ _id : product.category  });

    // elimino img de cloudinary
    // if(product.img){
    //   const nameArr = product.img.split('/');
    //   const name = nameArr [ nameArr.length - 1 ];
    //   const [ public_id] = name.split('.');
    //   cloudinary.uploader.destroy( `FoodApp/${category.name}/${public_id}`);
    
    // }
    
      product = await Product.findByIdAndUpdate( product.id,  { status : false , rest },{ new:true }).populate("category", "name");

console.log(product);
  res.json({ 
      success: true,
      product      
  });


  } catch (error) {

    console.log('desde deleteProduct: ', error);
    return res.status(500).json({
      success: false,
      msg: "Opps algo salió mal al intentar eliminar un producto"
    })
  }

    
}

const pausePlayProductByID = async (req, res) => {

 const pauseOrPlay = req.query.pauseOrPlay;

   if(pauseOrPlay == undefined){
    return res.status(400).json ({
      success: false,
      msg: "Se debe incluir un query string en true o false"
    })
   }
   
    try {
    
      const { id } = req.params;
      const { ...rest } = req.body;

  
      let product = await Product.findOne({ _id : id });
  
      if(!product) {
        return res.status(400).json({ 
          success: false,
          msg: "Producto no encontrado",      
        });
      }
  
      if(!product.status) {
        return res.status(400).json({ 
          success: false,
          msg: "El producto que intenta PAUSAR esta dado de baja de la Base de Datos",      
        });
      }

      // NO SE SI ESTO LO VOY A USAR TENGO NOTAS ACERCA DE ESTO
      // busca si el producto q quiere PAUSAR esta en una orden temporal, puede estar en cualquiera de las colecciones de productos PERO ademas tiene q cumplir con la condicion de q este "INCOMPLETE"
      const existInTempOrder = await TempPurchaseOrder.find({
        $or:[
                 { "fries._id"   :  product._id }, 
                 { "drink._id"   :  product._id }, 
                 { "product._id" :  product._id }, 
            ],
        $and : [ 
                { statusOrder : "INCOMPLETE"}
              ]    
      })
  
      if(existInTempOrder.length != 0 ) {
        return res.status(400).json({ 
          success: false,
          msg: "No se puede pausar el producto, existen ordenes temporales de clientes que contienen estos productos, los mismos se eliminan automaticamente cada 12 o 24 hs dependiendo de las reglas de negocio",
        });
      }

      console.log(pauseOrPlay, false);
    // si viene FALSE significa q quiero pausar  
      if(pauseOrPlay == "false" ){
          product = await Product.findByIdAndUpdate( product.id, { paused : true , rest },{ new:true }).populate("category", "name state paused");
      }else{
          product = await Product.findByIdAndUpdate( product.id, { paused : false , rest },{new:true }).populate("category", "name state paused");
      }


    
      res.json({ 
        success: true,
        category: product.category, 
        product      
       });

    } catch (error) {
  
      console.log('desde pauseProductByID: ', error);
      return res.status(500).json({
        success: false,
        msg: "Opps algo salió mal al intentar PAUSAR un producto"
      })
    }
}

const pausePlayCategory = async (req, res) => {

  const { playOrPause, _id } = req.body;

   try {
   
    const category = await Category.findOne( {id:_id} ) ;

    if(category == null){
      return res.status(400).json({
        seuccess : false,
        msd : "No existe la categoria"
      })
    }
 // esta en pausa, quiero activar
     if(playOrPause == "false" ){
         await Category.findByIdAndUpdate( _id, { paused : false  },{ new:true });
         const products = await Product.find({ category: _id });
         await Product.updateMany({ category: _id }, { paused: false });

     } 
 // esta activo, quiero pausar
     
     if(playOrPause == "true"){

       await Category.findByIdAndUpdate( _id, { paused : true },{ new:true });
       const products = await Product.find({ category: _id });
       await Product.updateMany({ category: _id }, { paused: true });

     }
  
   
     res.json({ 
       success: true,
       msg: "ok",      
      });
  

   } catch (error) {
 
     console.log('desde pausePlayCategory: ', error);
     return res.status(500).json({
       success: false,
       msg: "Opps algo salió mal al intentar PAUSAR una categoría"
     })
   }
}

const deleteManyProduct = async (req, res) => {
  try {

    // la idea de q este metodo es eliminar todos los productos de una categoria, OJO tambien hay  
      const { categoryId } = req.params;

      const category = await Category.findOne({ _id : categoryId });

      if(!category){
        return res.status(400).json({
          success: false,
          msg: 'Categoria de producto no encontrada'
        })
      }
      // elimino la categoria de cloudinary junto con todos los productos
      if(category.name){
       await cloudinary.api.delete_resources_by_prefix(`FoodApp/${category.name}`).then(res => console.log(res));
       await cloudinary.api.delete_folder(`FoodApp/${category.name}`).then(res => console.log(res));
      }
         await Product.deleteMany({ category : categoryId})
      
        res.json( {
          success: true, 
          msg: `Los productos de la categoria ${category.name} fueron eliminados correctamente` 
        } );  
      
    
    } catch (error) {
      console.log('error desde deleteManyProduct: ', error);
    
      return res.status(500).json({
        success: false,
        msg: "Oops algo salió mal al intentar editar un producto"
      })
    
    }

  
    
}

module.exports = {
              createProduct,
              updateProduct,
              deleteProduct,
              updateManyPrice,
              deleteManyProduct,
              pausePlayProductByID,
              getProduct,
              pausePlayCategory

}