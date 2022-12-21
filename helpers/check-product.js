
const Product = require('../models/product');

    //ESTAS VALIDACIONES ESTAN XQ PUEDE SER Q AL MOMENTO DE REALIZAR LA COMPRA UN PRODUCTO SE DE BAJA O MENU O LO QUE SEA, EN ESE CASO HABRIA Q ANULAR LA COMPRA!!! RECORDAR Q NO TIENE SOCKETS EN TIEMPO REAL


const checkProduct = async ( productID ) => {
  console.log('entra', productID);

    const checkRol = await Product.findOne({_id : productID._id});
    if(!checkRol){
        throw new Error (`el role ${drink} no esta regitrado en DB`)
    }
}
  
  
  // return new Promise ( ( resolve, reject ) => { 

   

  //   if(product.status != true){
    
  //     return reject("Producto dado de baja de la BD");
       
  //    }

  //   if(product.stock != true){
  //     return reject("Producto sin stock");
  //   }

  //    return resolve(product);
  // })
    



 
    



module.exports= checkProduct