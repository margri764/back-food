


const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const updateStock  = require('../helpers/stock-managment');

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
        // console.log(productsToUpdate, arrIDs);
        
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
                 order.product.forEach((product) => {
                 productIDs.push( {_id:product._id, quantity : product.quantity} ); 
                 });
                 
                 order.drink.forEach((drink) => {
                 productIDs.push( {_id:drink._id, quantity : drink.quantity} );
                 });

                 order.fries.forEach((fries) => {
                 productIDs.push( {_id:fries._id, quantity : fries.quantity} );
                 });
             });

            //  console.log(productIDs);

            // controlo si hay stock de esos productos
            for (let i = 0; i < productIDs.length; i++) {
              const item = productIDs[i];
              productToUpdate= await updateStock(item);
              productsToUpdate.push(productToUpdate)

            }

            const productUpdates = productsToUpdate.map(item => ({
              updateOne: {
                filter: { _id: item._id },
                update: { $set: { stockQuantity: item.quantity } }
              }
            }));
            
            await Product.bulkWrite(productUpdates);
             
 
            await TempPurchaseOrder.updateMany(
                { user : user._id}, //QUERY para decirle que campo debe editar
                {"$set":{"statusOrder": "COMPLETE"}},   // le paso el valor de reemplazo
                ) //Filtra los documentos que quieres actualizar
         
     

        // //   coloco en duro el id de un miembro del staff q no tiene datos, es solo para pasar la validacion del Schema de la PurchseOrden      
        const orderEdit = {
            date : new Date(),
            staff : "64146a956a7c1e1ccb4e28c0",
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

// son las ordenes q ve el cliente en "ordenes en proceso", la orden de compra NO tiene su finished = true 
const getUserOrder= async ( req , res ) => {

    const user = req.userAuth
    
    try {
        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [ 
                        {
                          path: 'product',
                          model: "Product",
                        },
                        {
                          path: 'product._id',
                          model: "Product",
                        },
                        {
                          path: 'fries._id',
                          model: "Product",
                        },
                        {
                          path: 'drink',
                          model: "Product",
                        },
                        {
                          path: 'drink._id',
                          model: "Product",
                        },
                        {
                          path: 'user',
                          model: "User",
                        },
                      ],
           })
    
   
    
       
        res.json({ 
            success : true,
            purchaseOrder
    
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

 
}

const getUserHistoryPurchaseOrders= async ( req , res ) => {

    const {id} = req.params;
    console.log(id);

    try {
        const purchaseOrder = await PurchaseOrder.find({ user: id, finished: true }) 
        .populate( {
            path: 'order', 
            populate: [ 
                        {
                          path: 'product',
                          model: "Product",
                        },
                        {
                          path: 'product._id',
                          model: "Product",
                        },
                        {
                          path: 'fries._id',
                          model: "Product",
                        },
                        {
                          path: 'drink',
                          model: "Product",
                        },
                        {
                          path: 'drink._id',
                          model: "Product",
                        },
                        {
                          path: 'user',
                          model: "User",
                        },
                      ],
           })
    
   
    
       
        res.json({ 
            success : true,
            purchaseOrder
    
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

 
}

// son las ordenes que recibe el dashboard para editar y demas
const getStaffOrder= async ( req , res ) => {

    const user = req.userAuth
    
    try {
        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [ 
                        {
                          path: 'product',
                          model: "Product",
                        },
                        {
                          path: 'product._id',
                          model: "Product",
                        },
                        {
                          path: 'fries._id',
                          model: "Product",
                        },
                        {
                          path: 'drink',
                          model: "Product",
                        },
                        {
                          path: 'drink._id',
                          model: "Product",
                        },
                        {
                          path: 'user',
                          model: "User",
                        },
                      ],
           })
    
        if(!purchaseOrder){
    
            return res.status(400).json ({
                success : false,
                msg : `No se encontraron ordenes para el usuario ${user.firstName} ${user.lastName} `
            })
        }
    
    
       
        res.json({ 
            success : true,
            purchaseOrder
    
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

 
}

// creo q no va xq tengo la "editOrderStatus en StaffOrder.controller"
const editOrder= async ( req , res ) => {
    try {

    const {id, status} = req.body

    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, {statusOrder: status}, {new:true})

    if(!purchaseOrder){

        return res.status(400).json({
            success : false,
            msg: "No existe la orden q se intenta editar"
        })

    }

        res.json({ 
            success : true,
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar editar el estado de la orden `
        })

    }
 
}





module.exports={
    createOrder,
    editOrder,
    getUserOrder,
    getStaffOrder,
    getUserHistoryPurchaseOrders

}