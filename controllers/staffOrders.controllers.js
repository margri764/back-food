
const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const checkStatus  = require('../helpers/check_status');
const { customDate }  = require('../helpers/format-date');


const editOrderStatus = async ( req , res ) => {
 
    try {
    
        const { id, status  } = req.body;

        console.log(id);
        
        const staff = req.userAuth

    
        // busco si la orden de compra existe        
        const purchaseOrder = await PurchaseOrder.findById( id ) || null;
        // console.log(purchaseOrder._id);

        
        if(purchaseOrder == null){
            return res.status(400).json({
                success:false,
                msg: "Orden de compra no encontrada"
            })
        }

        // busco en "PurchaseOrderStatus" si hay algun doc q tenga esa orden asociada
        
        // let purchaseOrderStatus = await PurchaseOrderStatus.findOne( {order : purchaseOrder._id} ) || null;
        // console.log(purchaseOrderStatus);

        // recibo el status en el body y lo evaluo
         checkStatus(status);
        
         let finished = false;
         if(status == "COMPLETADO") {
            finished = true
         }

        /*   esto son los datos q necesito para el campo "statusOrder" (está en el models de PurchaseOrderStatus), es un array de objetos
        q me permite ir guardando los cambios de estados con elm dato del momento en q se hizo y quien lo hizo (recordar q puede 
            cambiar el miembro del staff tambien)*/
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

        //     /*si no hay ningun estado de orden asociado a la orden de compra la genero, el push es xq en el models  */
        //  orderStatus = new PurchaseOrderStatus ({statusOrder : orderEdit, order : purchaseOrder._id })
         
        // //  en este punto hago un update en el sattus de la orden tambien, en el get del front deberia llamar solo a las ordenes de compra q no tengan el estado en complete y en el estado para conocer todos los movimientos y quien es el responsable (podria tener en la orden una referencia a este modelo de estado)
        //   await PurchaseOrder.findByIdAndUpdate( purchaseOrder._id, { statusOrder : status} ,{new:true})


        //  await orderStatus.save()

        //     return res.status(200).json({
        //         success : true,
        //         orderStatus
        //     })
     
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
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

}

const getStaffOrdersByQuery= async ( req , res ) => {

    // let { year, month, day, hour, searchType } = req.query;
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

const getStaffOrdersNoProcess = async ( req, res ) =>{

    // const statusNoProcess = await PurchaseOrder.find({statusOrder})

    const [ total, unFinishedPurchaseOrder ] = await Promise.all([
        PurchaseOrder.countDocuments( {finished : false}),
        PurchaseOrder.find( {finished : false} ).populate('user')
         
    ])  
   
    res.status(200).json({
        total,
        unFinishedPurchaseOrder
    })


}

module.exports = { 
                    getStaffOrders,
                    editOrderStatus,
                    getStaffOrdersNoProcess,
                    getStaffOrdersByQuery
                 }