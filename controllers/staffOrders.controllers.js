
const PurchaseOrder = require('../models/purchaseOrder');
const checkStatus  = require('../helpers/check_status');
const { customDate }  = require('../helpers/format-date');


const editOrderStatus = async ( req , res ) => {
 
    try {
    
        const { id, status  } = req.body;

        const staff = req.userAuth

        // busco si la orden de compra existe        
        const purchaseOrder = await PurchaseOrder.findById( id ) || null;
        
        if(purchaseOrder == null){
            return res.status(400).json({
                success:false,
                msg: "Orden de compra no encontrada"
            })
        }


        // recibo el status en el body y lo evaluo
         checkStatus(status);
        
         let finished = false;
         if(status == "COMPLETADO") {
            finished = true
         }


        const orderEdit = {
            date : new Date(),
            staff : staff._id,
            status : status    
        };


        let arrOrders = [];
        let orderStatus; 

        // busco en las ordenes con status si hay alguno que tenga la orden de compra que quiero editar en el caso de ya haya una orden en  proceso q haga un update, caso contrario que cree una nueva orden en el status (digo statua peroe es la coleccio PurchaseOrderStatos obviamente)

        if(purchaseOrder != null){
 
            /*como se trata de un update, primero guardo en un arreglo todos los objetos q ya hay en el campo "statusOrder" y despues le agrego el objeto recien creado */
            purchaseOrder.statusOrder.map( status => {arrOrders.push(status)});
       
            arrOrders.push(orderEdit);

            orderStatus = await PurchaseOrder.findByIdAndUpdate( purchaseOrder._id, { statusOrder : arrOrders , finished : finished}, { new:true })
            
            return res.status(200).json({
                success : true,
                orderStatus
            })
        } 


     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al editar orden de compra'
        });
    }
    
  
}

const getStaffOrders= async ( req , res ) => {

  

    try {
        const [  total, staffOrders] = await Promise.all([

        PurchaseOrder.countDocuments( ),
        PurchaseOrder.find( {finished : !"COMPLETADO"} )
        .populate([
            {
              path: 'user',
              model: "User",
            },
            {
              path: 'statusOrder.staff',
              model: "Staff",
            },
            {
            path: 'order', 
            populate: [
                       { 
                          path: 'drink',
                          model: "Product",
                       },
                       {
                          path: 'drink._id',
                          model: "Product",
                       },
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
                       
                    ]
             },
        
              ])

            ])
        
        res.json({ 
            total,
            staffOrders
        })
        
    } catch (error) {
        console.log('desde GetStaff Orders: ', error);
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

}

const getStaffOrdersByQuery= async ( req , res ) => {

    const date = req.query;

    if(!date){
        return res.status(400).json({
            success: false,
            msg: "No existe fecha a buscar - error en la peticion"
        })
    }
    
    const {start, end} =  customDate(date);

     try {
         const [  total, staffOrders] = await Promise.all([
 
         PurchaseOrder.countDocuments( ),
         PurchaseOrder.find( {
                              "createdAt": { $gte: start, $lte: end }
                             } 
                           )
         //    .count()
         .populate([
             {
               path: 'user',
               model: "User",
             },
             {
               path: 'statusOrder.staff',
               model: "Staff",
             },
             {
             path: 'order', 
             populate: [
                        { 
                           path: 'drink',
                           model: "Product",
                        },
                        {
                           path: 'drink._id',
                           model: "Product",
                        },
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
                     ]
              },
         
               ])
 
             ])
         
         res.json({ 
             total,
             staffOrders
         })
         
     } catch (error) {
         return res.status(500).json ({
             success : false,
             msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
         })
 
     }
 
 }

// const getStaffOrdersNoProcess = async ( req, res ) =>{

//     // const statusNoProcess = await PurchaseOrder.find({statusOrder})

//     const [ total, unFinishedPurchaseOrder ] = await Promise.all([
//         PurchaseOrder.countDocuments( {finished : false}),
//         PurchaseOrder.find( {finished : false} ).populate('user')
         
//     ])  
   
//     res.status(200).json({
//         total,
//         unFinishedPurchaseOrder
//     })


// }

module.exports = { 
                    getStaffOrders,
                    editOrderStatus,
                    // getStaffOrdersNoProcess,
                    getStaffOrdersByQuery
                 }