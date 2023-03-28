
const TempPurchaseOrder = require ('../models/tempPurchaseOrder');
const Product = require ('../models/product');

const updateStock  = async (productId,) => {

//    console.log(productId);
   /* recibe cada producto q esta en la TempPurchaseOrder y la cantidad q compro. Ahora busca en la coleccion de PRODUCT por id, para conocer el stock real */
    const existingProduct = await Product.findOne({_id: productId});
    //  console.log(existingProduct.stockQuantity);
    /* compara el stock real con la cantidad q compro (recordar q esto esta xq puede haver diferencia en el tiempo entre q crea la 
    orden temporal y la orden de compra) */
    if (existingProduct.stockQuantity < productId.quantity) {
      throw new Error(`No hay suficiente stock disponible para el producto ${existingProduct.name}`);
    }

    /* si sale todo ok le resta a la cantidad del producto, la cantidad comprada y hace el update del producto */
    const updatedQuantity = existingProduct.stockQuantity - productId.quantity;

    return {_id: existingProduct._id, quantity: updatedQuantity}
  }


module.exports=  updateStock