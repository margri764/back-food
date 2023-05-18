
const TempPurchaseOrder = require ('../models/tempPurchaseOrder');
const Product = require ('../models/product');

const updateStock  = async (productId,) => {

   /* recibe cada producto q esta en la TempPurchaseOrder y la cantidad q compro. Ahora busca en la coleccion de PRODUCT por id, para conocer el stock real */
    const existingProduct = await Product.findOne({_id: productId});
  
    /* compara el stock real con la cantidad q compro (recordar q esto esta xq puede haver diferencia en el tiempo entre q crea la 
    orden temporal y la orden de compra) */
    if (existingProduct.stockQuantity < productId.quantity) {
      throw new Error(`No hay suficiente stock disponible para el producto ${existingProduct.name}. ${productId.orderId}`);
    }

    /* si sale todo ok le resta a la cantidad del producto, la cantidad comprada y hace el update del producto */
    const updatedQuantity = existingProduct.stockQuantity - productId.quantity;


    return {_id: existingProduct._id, quantity: updatedQuantity}
}

const updateStockFromTempOrder  = async (productId,) => {


  /* recibe cada producto q esta en la TempPurchaseOrder y la cantidad q compro. Ahora busca en la coleccion de PRODUCT por id, para conocer el stock real */
   const existingProduct = await Product.findOne({_id: productId});
 
   /* compara el stock real con la cantidad q compro (recordar q esto esta xq puede haver diferencia en el tiempo entre q crea la 
   orden temporal y la orden de compra) */
   if (existingProduct.stockQuantity < productId.quantity) {
     throw new Error(`Producto ${existingProduct.name} sin stock, por favor elegí otra opción`);
   }

   /* si sale todo ok le resta a la cantidad del producto, la cantidad comprada y hace el update del producto */
   const updatedQuantity = existingProduct.stockQuantity - productId.quantity;

   return {_id: existingProduct._id, quantity: updatedQuantity}
}
 
  
const checkIfExistTempOrder  = async (tempOrderId) => {
      const existingOrder = await TempPurchaseOrder.findOne({_id: tempOrderId});

      if (existingOrder === null) {
        throw new Error(`No se encuentra la order Temporal para ser eliminada` );
      }
 
      return existingOrder._id
}

const checkStatusAndPaused  = async (productId,) => {

  /* recibe cada producto q esta en la TempPurchaseOrder y la cantidad q compro. Ahora busca en la coleccion de PRODUCT por id, para conocer el stock real */
   const existingProduct = await Product.findOne({_id: productId});
 
   console.log("entro aqui");
   if (existingProduct.status === false || existingProduct.paused === true) {
     throw new Error(`El producto ${existingProduct.name} esta pausado o eliminado. Disculpe las molestias`);
   }

   /* si sale todo ok le resta a la cantidad del producto, la cantidad comprada y hace el update del producto */
   const updatedQuantity = existingProduct.stockQuantity - productId.quantity;


   return {_id: existingProduct._id, quantity: updatedQuantity}
}

module.exports =  {
                   updateStock,
                   updateStockFromTempOrder,
                   checkIfExistTempOrder,
                   checkStatusAndPaused
                  }