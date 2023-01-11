
const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const checkStatus  = require('../helpers/check_status');



const getStaffOrder= async ( req , res ) => {
    
    // const user = req.staffAuth

    // const { limite=5 , desde =0 }=req.query;

    // ENVIO MEDIANTE QUERY EL TIPO DE ESTADO QUE NECESITO EN EL FRONT
    const { status } = req.query;


    const [ total,  staffOrders] = await Promise.all([

    // ENVIO MEDIANTE QUERY EL TIPO DE ESTADO QUE NECESITO EN EL FRONT
         // PurchaseOrder.countDocuments( {statusOrder : status}),
        //  PurchaseOrder.find( {statusOrder : status} )
        
        PurchaseOrderStatus.countDocuments( ),
        PurchaseOrderStatus.find( )
        .populate([
            { 
                path: 'user',
                model: "User",
             },
            {
            path: 'order', 
            populate: [
                   
                       {
                          path: 'order',
                          model: "TempPurchaseOrder",
                       
                         populate: [ 
                                    {
                                      path: 'product',
                                      model: "Product",
                                    },
                                    {
                                      path: 'drink._id',
                                      model: "Product",
                                    },
                                  
                                   ]
                        }
                      ]}
                    ])
         ])

    res.json({ 
        total,     
        staffOrders

    });
}



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
       
            arrOrders.unshift(orderEdit);

            console.log(arrOrders);
            
            orderStatus = await PurchaseOrder.findByIdAndUpdate( purchaseOrder._id, { statusOrder : arrOrders} ,{new:true})
            
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
        const [ total, staffOrders] = await Promise.all([

        PurchaseOrder.countDocuments( ),
        PurchaseOrder.find( )
        .populate([
            {
              path: 'user',
              model: "User",
            },
            {
            path: 'order', 
            populate: [
                       { 
                          path: 'drink',
                          model: "TempPurchaseOrder",
                       },
                       {
                          path: 'drink._id',
                          model: "Product",
                       },
                       {
                          path: 'product',
                          model: "Product",
                       },
                     
                    ]
                }])
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

module.exports = { 
                 getStaffOrders,
                 editOrderStatus
}