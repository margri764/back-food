
const Product = require('../models/product');
const Staff = require('../models/staff');
const Category = require('../models/category');
const { validExtension } = require('../helpers/upload-file');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const { checkValue } = require('../helpers/value-percent');
const { findById } = require('../models/product');

const cloudinary= require ('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);



const createProduct =  async (req, res) => {
    
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

const getPausedProduct = async (req, res) => {


  const pausedProduct = await Product.find({ stock : false }) ;


  // if(pausedProduct.length == 0){
  //   return res.status(500).json({
  //       success: false,
  //       msg: "No se encuentran productos pausados"
  //   })
  // }

res.status(200).json({
        success: true,
        pausedProduct
  });
}

const getProductByCategory = async (req, res) => {

  //la idea con esto es q los arreglos de comidas se llenen con categorias q existan en BD

const findCatOne  = await Category.findOne({name: "BURGER"})  || null;
const findCatTwo  = await Category.findOne({name: "PIZZA"})   || null;
const findCatTree = await Category.findOne({name: "HEALTHY"}) || null;
const findCatFour = await Category.findOne({name: "VEGAN"})   || null;
const findCatFive = await Category.findOne({name: "DRINK"})   || null;
const findCatSix  = await Category.findOne({name: "FRIES"})   || null;

// OJO VALIDAR SI ESTAN EN STOCK O EXISTEN EN BD!!!!!!!!!!!!!!!!!

const burger  = await Product.find({ status : true, stock: true, category : findCatOne._id }).populate("category", "name")
const pizza   = await Product.find({ status : true, stock: true, category : findCatTwo._id }).populate("category", "name")
const healthy = await Product.find({ status : true, stock: true, category : findCatTree._id }).populate("category", "name")
const vegan   = await Product.find({ status : true, stock: true, category : findCatFour._id }).populate("category", "name")
const fries   = await Product.find({ status : true, stock: true, category : findCatSix._id }).populate("category", "name")
const drink   = await Product.find({ status : true, stock: true, category : findCatFive._id }).populate("category", "name")

//modifico la propiedad value a numero entero mas cercano
// pizza.map( (item) =>
//   { 
//     [...pizza],
//      item.price = Math.round(item.price)
//   } 
// );
// healthy.map( (item) =>
//   { 
//     [...healthy],
//      item.price = Math.round(item.price)
//   } 
// );
// vegan.map( (item) =>
//   { 
//     [...vegan],
//      item.price = Math.round(item.price)
//   } 
// );
// drink.map( (item) =>
//   { 
//     [...drink],
//      item.price = Math.round(item.price)
//   } 
// );


res.json({
      burger,
      pizza,
      healthy,
      vegan,
      drink,
      fries
  });
}

const updateProduct = async ( req, res) => {

try {
  

const { category, id} = req.params;

 // recibo el string del form-data body y lo parseo. El req.body trae todo el append o sea q la imagen y el body por separado por eso desestructuro, "body" es el nombre de la propiedad en el append
const  { body, img}  = req.body;


//  esto lo hago xq no siempre se edita la img, sino tira error cuando intenta leer el req.file
let fileInReq;
if(img == 'no-image' ){
  fileInReq = false;
}else{
  fileInReq = true;
}


let editProduct= JSON.parse(body);


const { name, ...rest } = editProduct; 

      
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

  const valid = validExtension(req.files.img, res);

  if(valid != true){
    return 
  }

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
  
  const product= await Product.findByIdAndUpdate( productEdit._id, tempProduct,{new:true})
  

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
  const categoryId = req.validCat 

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
    
  let { name } = await Category.findById( categoryId ) || null; //busca el id en la BD 
 
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

const pauseCategory = async ( req, res) => {

  try {
  
    // esto viene del middleware Category
    const categoryId = req.validCat 

    const nameCategory = await Category.findById(categoryId) 
  
    const  { playOrPause }  = req.body;
    
    
    // si es true pauso la
      if(playOrPause){
        await Product.updateMany(
          { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
          { "$set": { status : true } },   // le paso el valor de reemplazo
          { "multi": true }
          )
      }else{
        await Product.updateMany(
          { "category" : categoryId }, //condición q debe cumplir el doc para ser editado
          { "$set": { status : false } },   // le paso el valor de reemplazo
          { "multi": true }
          )
      }
      
    res.json( {
     success: true,
     msj : `Se pauso correctamente la categoria  ${nameCategory.name}. Recuerde que no se mostraran los productos en la app`  
   } );  
    
  
  } catch (error) {
    console.log('error desde pauseCategory: ', error);
  
    return res.status(500).json({
      success: false,
      msg: "Oops algo salió mal al intentar pausar una categoria"
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
    
     await Product.findByIdAndUpdate( product.id,  { status : false , rest },{ new:true });


  res.json({ 
      success: true,
      msg: "Producto eliminado correctamente",      
  });


  } catch (error) {

    console.log('desde deleteProduct: ', error);
    return res.status(500).json({
      success: false,
      msg: "Opps algo salió mal al intentar eliminar un producto"
    })
  }

    
}

const pauseProductByID = async (req, res) => {

   const {isPaused } = req.query;

   
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
          msg: "El producto que intenta PAUSAR esta dado de baja de la Base de Datos",      
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
          msg: "No se puede pausar el producto, existen ordenes temporales de clientes que contienen estos productos, los mismos se eliminan automaticamente cada 12 o 24 hs dependiendo de las reglas de negocio",
        });
      }

   console.log(isPaused);

  // esto es la pausa
      if(isPaused == "false" ){
        console.log('here');
          await Product.findByIdAndUpdate( product.id,  { stock : false , rest },{ new:true });
      } 
      
      if(isPaused == "true"){
        console.log('now here');

        await Product.findByIdAndUpdate( product.id,  { stock : true , rest },{ new:true });
      }
          // if(!product.stock) {
          //   return res.status(400).json({ 
          //     success: false,
          //     msg: "El producto que intenta PAUSAR ya esta pausado",      
          //   });
          // }
    
      res.json({ 
        success: true,
        msg: "ok",      
       });
   

    } catch (error) {
  
      console.log('desde pauseProductByID: ', error);
      return res.status(500).json({
        success: false,
        msg: "Opps algo salió mal al intentar PAUSAR un producto"
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
              pauseProductByID,
              pauseCategory
}