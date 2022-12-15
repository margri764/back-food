


const {response, request} = require ('express');
const path = require('path');
const fs   = require('fs');
const Product = require('../models/product');
const Staff = require('../models/staff');
const { upFiles } = require("../helpers/upload-file");
const cloudinary= require ('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);



const createProduct =  async (req = request, res = response) => {
    
    // const { id }  = req.params;
    const user = req.staffAuth;

    // recibo el string del form-data body y lo parseo
    let { postProduct } = req.body;
    postProduct= JSON.parse(postProduct);
 
   const { name, ...rest } = postProduct; 

   const { tempFilePath } = req.files.file;

   const {secure_url} = await cloudinary.uploader.upload( tempFilePath, {folder: "Food App"} );

 
    

    //busco si el producto ya esta creado lo q puedo usar es el nombre
    let product = await Product.findOne({name : name}) || null;

    const staff = await Staff.findById(user._id) || null;



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



  // const fullPath= await upFiles(req.files); 

    
    const tempProduct = {
        ...rest,
           staff : staff._id,
           name,
           img: secure_url
    }

    product =  new Product (tempProduct);

    product.save()

    res.status(200).json({
        success: true,
        product,
        // img

    })


}

const getProduct = async (req,res)=>{

  const { limite=5 , desde =0 }=req.query;

  const [ total, product] = await Promise.all([

      Product.countDocuments( {status:true}),
      Product.find( {status:true} )
          .populate('staff','name')
          // .populate('category','name')
          .skip( Number (desde))
          .limit( Number (limite))
  ])
 
  res.json({ 
      total,     
      product

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
  





// const updateImage = async ( req, res) => {


//     // ese id voy a ver si lo puedo sacar desde el staffAuth
//     // como los update y post de productos lo voy a hacer yo puedo mandar mi id desde postman con params
//     // puedo validar q solo yo pueda hacer eso con un super-rol especial 
//   const { colection, id} = req.params;

//   let models; 

//   switch ( colection ) {
//     case 'users': 
      
//     models = await Usuario.findById( id );  
//       if (!models){
//         return res.status(400).json ({
//           msg: `no existe un usuario con el id ${ id }`
//         });
//       }
      
//       break;

//       case 'products': //es el nombre de la coleccion q esta en MongoDB
      
//       models = await Product.findById( id ); //busca el id en la BD 
//         if (!models){
//           return res.status(400).json ({
//             msg: `no existe un producto con el id ${ id }`
//           });
//         }
        
//         break;  

  
//     default:
//       return res.status(500).json ({
//         msg: 'se me olvido validar esto'
//       });
//   }
//  //limpiar imagenes

//   if(models.img){

//     /*hay q borrar la imagen del servidor, armo el path completo con el nombre de la 
//     coleccion y el path de la img propiamente dicha ("models.img")*/ 
//     let pathImage = path.resolve( __dirname, '../uploads', colection, models.img );
//     if ( fs.existsSync( pathImage ) ) {
//       fs.unlinkSync( pathImage);
           
//     }
//   }

//   const fullPath= await upFiles(req.files, colection); 
//   models.img = fullPath;  
//   await models.save(); 
  
//   res.json(models);
  
// }

module.exports={
    createProduct,
    getProductById,
    getProduct

}