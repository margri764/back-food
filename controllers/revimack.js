
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const {updateStock}  = require('../helpers/stock-managment');
const { ObjectId } = require('mongodb');


const createOrder= async ( req , res ) => {

    // hasta este punto ya valide que existen los productos y que tienen stock distinto a cero
    try {

        const user = req.userAuth
        const { order, delivery, ...rest }= req.body;

        let arrIDs = [];
        let tempTotal = [];
        let productToUpdate = [];
        let productsToUpdate = [];

        // obtengo de la orden todos los objetos productos y los guardo en un array
        order.forEach((item) => { arrIDs.push(item._id) });
        
        // obtengo el total
        tempTotal = order.filter( item =>  item.total);
        tempTotal.forEach( item => { total = item.total });

        // obtengo las ordenes temporales por id
        let orderIds = await TempPurchaseOrder.find({_id : { $in: arrIDs }})

             let productIDs = [];

             /*  Recorro las orderIds (TempPurchaseOrder) para obtener los IDs y quantity de cada producto por categoria.
                deberia validar al momento de crear la orden temporal si es q hay stock o sea doble validacion xq esta el caso de 
                que crea una orden temporal, espera media hora y hace la compra, en esos casos pueda que haya stock al momento de crearla
                pero no al momento de comprarla */
              orderIds.forEach((order) => {
                const orderId = order._id; // Acceder al _id del objeto order

                order.product.forEach((product) => {
                  productIDs.push({_id: product._id, quantity: product.quantity, orderId: orderId});
                });
                order.drink.forEach((drink) => {
                  productIDs.push({_id: drink._id, quantity: drink.quantity, orderId: orderId});
                });
                order.fries.forEach((fries) => {
                  productIDs.push({_id: fries._id, quantity: fries.quantity, orderId: orderId});
                });
              });
                
             
             // controlo si hay stock de esos productos
             for (let i = 0; i < productIDs.length; i++) {
               let item = productIDs[i];
               productToUpdate= await updateStock(item);
               productsToUpdate.push(productToUpdate)
               
              }

              // preparo todos los productos de la orden para hacer el update
            const productUpdates = productsToUpdate.map(item => ({
              updateOne: {
                filter: { _id: item._id },
                update: { $set: { stockQuantity: item.quantity,
                                  stock: item.quantity === 0 ? false : true
                                }
                        } }
            }));
            
            await Product.bulkWrite(productUpdates);
             
 
            await TempPurchaseOrder.updateMany(
                { user : user._id}, //QUERY para decirle que campo debe editar
                {"$set":{"statusOrder": "COMPLETE"}},   // le paso el valor de reemplazo
                ) //Filtra los documentos que quieres actualizar
         
     

        // //   coloco en duro el id de un miembro del staff q no tiene datos, es solo para pasar la validacion del Schema de la PurchseOrden      
        const orderEdit = {
            date : new Date(),
            staff : ObjectId("641d9aafa88c3483b9613f16"),
            status : 'SIN PROCESAR'    
        };


        const tempOrder = {
            user : user._id,
            addressDelivery : delivery,
            order : orderIds,
            total : total,
            statusOrder: orderEdit,
            finished: false,
            ...rest
        }
        // aca grabo la orden de compra del cliente 
        const purchaseOrder =  new PurchaseOrder (tempOrder);
        
        await purchaseOrder.save()

        res.status(200).json({
                success: true,
                purchaseOrder,
        })


    } catch (error) {
      console.log('Error desde CreateOrder: ', error);
      let errorMessage = 'Ooops algo salio mal al crear la orden';
    
      // Verificamos si el error es específico generado en la condición "if"
      if (error.message.includes('No hay suficiente stock disponible para el producto')) {
        errorMessage = error.message;
      }
        return res.status(500).json({
            success: false,
            msg: errorMessage
        })
        
    }
    



      

     


}
