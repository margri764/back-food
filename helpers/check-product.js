
const Product = require('../models/product');

    //ESTAS VALIDACIONES ESTAN XQ PUEDE SER Q AL MOMENTO DE REALIZAR LA COMPRA UN PRODUCTO SE DE BAJA O MENU O LO QUE SEA, EN ESE CASO HABRIA Q ANULAR LA COMPRA!!! RECORDAR Q NO TIENE SOCKETS EN TIEMPO REAL


const checkProduct = async ( productID  ) => {
  console.log('desde helper', productID);
   
  
    const product = await Product.findOne({_id : productID });
      

    if(!product){
        throw new Error (`el producto no esta registrado en DB`)
    }

    if(!product.status){
      throw new Error (`el producto ${product.name} esta en modo pausa o dado de baja en DB`)
    }

    if(!product.stock){
      throw new Error (`Sin stock del producto ${product.name}`)
    }
}
   
  



 
    



module.exports= checkProduct