


const {response, request} = require ('express');
const path = require('path');
const fs   = require('fs');
const Product = require('../models/product');
const Staff = require('../models/staff');
const Category = require('../models/category');
const { validCategory } = require('../helpers/db-validators');
const { stringify } = require('querystring');
const { validExtension } = require('../helpers/upload-file');

const cloudinary= require ('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);



const createProduct =  async (req = request, res = response) => {
    
    const { category }  = req.params;
    
    const user = req.staffAuth;

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

    const {secure_url} = await cloudinary.uploader.upload( tempFilePath, {folder: `Food App/${category}`});

    
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
        // img

    })


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
const drink   = await Product.find({ status : true, stock: true, category : findCatFive._id }).populate("category", "name")
const fries   = await Product.find({ status : true, stock: true, category : findCatSix._id }).populate("category", "name")


res.json({
      burger,
      pizza,
      healthy,
      vegan,
      drink,
      fries
  });
}

const getProductById = async (req, res) =>{

      const { id }  = req.params;

 
    

    //busco si el producto ya esta creado lo q puedo usar es el nombre

    const product = await Product.findById(id) || null;

     if (!product){
       return res.status(400).json ({
         msg: `no existe un producto con el id ${ id }`
       });
     }


     if(product.img){
      const pathImage = path.resolve( __dirname, '../uploads/img', product.img );
       if( fs.existsSync ( pathImage) ) {
          return  res.status(200).json( product )       
          // return  res.sendFile( pathImage, product )       
      }
    }

 
}

const updateProduct = async ( req, res) => {


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
    cloudinary.uploader.destroy( `Food app/${category}/${public_id}`);
  
  }

  const valid = validExtension(req.files.img, res);

  if(valid != true){
    return 
  }

  const { tempFilePath } = req.files.img;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder: `Food App/${category}`});

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
}


module.exports={
    createProduct,
    getProductById,
    getProductByCategory,
    updateProduct

}