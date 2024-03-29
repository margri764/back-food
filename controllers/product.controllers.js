
const Product = require('../models/product');
const Staff = require('../models/staff');
const Category = require('../models/category');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const { validExtension } = require('../helpers/upload-file');
const { checkValue } = require('../helpers/value-percent');

const cloudinary= require ('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);


const createProduct =  async (req, res) => {
    
    const { category }  = req.params;
    
    const user = req.userAuth;

    // recibo el string del form-data body y lo parseo
    let { postProduct } = req.body;
    postProduct= JSON.parse(postProduct);
 
   let { name, ...rest } = postProduct; 

   
   /* busco el nombre del producto para q no crear dos veces el mismo PERO tiene q estar con status:true o sea q si existe el nombre pero
   se encuentra "eliminado" de BD se puede volver a cargar */ 
   let product =        await Product.findOne({name : name, status: true}) || null; 
   const prodCategory = await Category.findOne({name : category.toUpperCase()},{state : true}) || null;
   const staff =        await Staff.findById(user._id) || null;

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

    if( staff == null){
        return res.status(400).json({
            success: false,
            msg: 'No se encuentra Empleado'
        })
    }

    //esto tendria q estar en un middleware o helper

    if( staff.stateAccount == false){
        return res.status(400).json({
            success: false,
            msg: 'Empleado eliminado o suspendido, hable con encargado'
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

const getPausedProduct = async (req, res) => {

const pausedProduct = await Product.find({ stock : false }) ;

res.status(200).json({
        success: true,
        pausedProduct
  });
}

const getProductByCategory = async (req, res) => {

  const userOrStaff = req.query.whoIs;


  if (userOrStaff === undefined || userOrStaff === null) {
    return res.status(400).json({
      success: false,
      msg: 'Se debe especificar si es una petición de un usuario o de un miembro del staff'
    });
  }
  
  const categoryNames = ["BURGER", "PIZZA", "HEALTHY", "VEGAN", "DRINK", "FRIES", "OFFER"];
  const categories = {};
  
  for (const categoryName of categoryNames) {
    const category = await Category.findOne({ name: categoryName });
  
    if (category && userOrStaff == "user" ) {
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
}

const getProduct= async (req, res) => {

const categoryNames = ["BURGER", "PIZZA", "HEALTHY", "VEGAN", "DRINK", "FRIES", "OFFER"];
const categories = {};
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

}

const updateProduct = async ( req, res) => {

try {
  

const { category, id} = req.params;



const  { body, img}  = req.body;

// recibo el string del form-data body y lo parseo. El req.body trae todo el append o sea q la imagen y el body por separado por eso desestructuro, "body" es el nombre de la propiedad en el append
 let editProduct= JSON.parse(body);

 let stockQuantityNumber = parseInt(editProduct.stockQuantity);

 const isPostiveNumber = Math.sign(editProduct.price); //verifica el signo del numero
 const isPostiveNumberQuantity = Math.sign(stockQuantityNumber); //verifica el signo del numero
//  
  if(isNaN(editProduct.price)){
    return res.status(400).json({
      success: false,
      msj : `El precio tiene que ser un numero mayor a 1. ${editProduct.price.toUpperCase()} no es un numero `
    })
  }

  if(isNaN(editProduct.stockQuantity)){
    return res.status(400).json({
      success: false,
      msj : `El stock tiene que ser un numero mayor a 1. ${stockQuantityNumber.toUpperCase()} no es un numero `
    })
  }


  // significa q es negativo
  if(isPostiveNumber == -1){
    return res.status(400).json({
      success: false,
      msj : `Solo se permite el ingreso de numeros mayores a 1. ${editProduct.price} no es un numero permitido `

    })
  }
  
  // significa q es negativo
  if(isPostiveNumberQuantity == -1){
    return res.status(400).json({
      success: false,
      msj : `Solo se permite el ingreso de numeros mayores a 1. ${stockQuantityNumber} no es un numero permitido `

    })
  }


//  esto lo hago xq no siempre se edita la img, sino tira error cuando intenta leer el req.file
let fileInReq;
if(img == 'no-image' ){
  fileInReq = false;
}else{
  fileInReq = true;
}

const { name,  ...rest } = editProduct; 

      
  let productEdit = await Product.findById(  id.trim() ) || null; //busca el id en la BD 

  const categoryUpdate = await Category.findOne({name: category.trim()}) || null;


  if (!productEdit){
    return res.status(400).json ({
      msg: `no existe un producto con el id ${ _id }`
    });
  }

 // limpiar imagenes y el condicional es para q no ejecute la limpieza xq pued eno venir una img nueva

if(fileInReq ) {

  if(productEdit.img){
    const nameArr = productEdit.img.split('/');
    const name = nameArr [ nameArr.length - 1 ];
    const [ public_id] = name.split('.');
    cloudinary.uploader.destroy( `FoodApp/${category}/${public_id}`);
  
  }

  // si la extension no es válida no se ejecuta mas, el metodo validExtensaion se encarga de contestar

  await validExtension(req.files.img, res);
//OJO ARREGLAR EL ERROR PARA Q MUESTRE LOS TROW

  const { tempFilePath } = req.files.img;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder: `FoodApp/${category}`});

  tempProduct = {
       ...rest,
      img :secure_url,
      category: categoryUpdate._id,
      name 
  
  }

}
// end no-image

tempProduct = {
  ...rest,
//  img :secure_url,
 category: categoryUpdate._id,
 name 

}

if(stockQuantityNumber > 0){
  tempProduct.stock = true;
}else{
  tempProduct.stock = false;
}
tempProduct.stockQuantity = stockQuantityNumber;
  
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

const updateManyPrice = async ( req, res) => {

try {

// la idea de q este metodo sirva para actualizar varios productos a la vez por campos y categoria/s 
const { categoryId, name } = req.validCat 

// recibo el body con el nombre del campo que quiero actualizar VALIDAR NUMEROS PRICE!!!!
  const  { value, operation }  = req.body;
  
  const isPostiveNumber = Math.sign(value); //verifica el signo del numero
  

// suma  
  if(isNaN(value)){
    return res.status(400).json({
      success: false,
      msj : `Solo se permite el ingreso de numeros. ${value} no es un numero `
    })
  }

  if(isPostiveNumber != 1){
    return res.status(400).json({
      success: false,
      msj : `Solo se permite el ingreso de numeros mayores a 1. ${value} no es un numero permitido `

    })
  }

  let numberDocUpdated;
  
  //SUMA
  if(operation.toUpperCase() == "SUMAR") {
    console.log("entro a sumar");
     numberDocUpdated= await Product.updateMany(
        { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
        { $inc : { price :  value  } },   // le paso el valor de reemplazo
        { "multi": true }
        )
   }
  
   // RESTA
   if(operation.toUpperCase() == "RESTAR") {
     numberDocUpdated= await Product.updateMany(
        { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
        { $inc : { price : - value  } },   // le paso el valor de reemplazo
        { "multi": true }
     )
 }

 // INCREMENTAR %
 if(operation.toUpperCase() == "INCREMENTAR %") {

    const pricePercent = checkValue(value);
    numberDocUpdated= await Product.updateMany(
      { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
      {  $mul: { price : pricePercent } },   // le paso el valor de reemplazo
      { "multi": true }
  )
}

// DECREMENTAR %
if(operation.toUpperCase() == "DECREMENTAR %") {

  let priceDec;
  let valueDec;
  if( value > 0 && value < 100 ) {
          valueDec = 100 - value;
          valueDec = valueDec / 100 ;
  }else{
    return res.status(400).json({
      success: false,
      msg:`${ value } no es un porcentage valido solo de 1 a 99%...`

    })
  }

  numberDocUpdated= await Product.updateMany(
    { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
    { $mul: { price : priceDec } },   // le paso el valor de reemplazo
    { "multi": true }
)
}
    
  res.json( {
   success: true,
   msj : `Se modificaron ${numberDocUpdated.modifiedCount} producto(s) de la categoria ${name}`  
 } );  
  

} catch (error) {
  console.log('error desde updateToMany: ', error);

  return res.status(500).json({
    success: false,
    msg: "Oops algo salió mal al intentar editar un producto"
  })

}
}

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

  const {playOrPause, _id } = req.body;

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
              getPausedProduct,
              getProductByCategory,
              updateProduct,
              deleteProduct,
              updateManyPrice,
              deleteManyProduct,
              pausePlayProductByID,
              getProduct,
              pausePlayCategory

}