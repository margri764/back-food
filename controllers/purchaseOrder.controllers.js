


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const checkStatus  = require('../helpers/check-status');


const createOrder= async ( req , res ) => {
    
    try {

        const user = req.userAuth
        const { order, ...rest }= req.body;

        // console.log(req.body);

        let arrIDs = [];
        let tempArrIds = []; 
        let tempTotal = [];
        
         order.forEach( item => arrIDs.push(item._id));
        // tempArrIds.forEach( item => { arrIDs.push(item.tempOrder) });

        tempTotal = order.filter( item =>  item.total);
        tempTotal.forEach( item => { total = item.total });

        let orderIds = await TempPurchaseOrder.find({_id : { $in: arrIDs }})

            await TempPurchaseOrder.updateMany(
                { user : user._id}, //QUERY para decirle que campo debe editar
                {"$set":{"statusOrder": "COMPLETE"}},   // le paso el valor de reemplazo
                ) //Filtras los documentos que quieres actualizar
         
        
        orderIds.map((item)=>{
            console.log("from: ",item.statusOrder) 
            
        })
        
            //  console.log(orderIds);

        // console.log());


        const tempOrder = {
            user : user._id,
            addressDelivery : user.addressDelivery,
            order : orderIds,
            total : total,
            // statusOrder,
            ...rest
        }

        const purchaseOrder =  new PurchaseOrder (tempOrder);

        purchaseOrder.save()

        res.status(200).json({
        success: true,
        purchaseOrder,

        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            msg: 'Ooops algo salio mal al crear la orden'
        })
        
    }
    



      

     
    // if(!product){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto no encontrado en BD"
    //     })
    //   }

    //   if(product.status != true){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto dado de baja en BD"
    //     })
    //   }

    //   if(product.stock != true){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto sin stock"
    //     })
    //   }
    



}


const getOrder= async ( req , res ) => {
    
    const user = req.userAuth

    try {

        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [{ 
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


const editOrder= async ( req , res ) => {
    
    const user = req.userAuth
    console.log(req.body);

    // try {

    //     const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
    //     .populate( {
    //         path: 'order', 
    //         populate: [{ 
    //                       path: 'drink',
    //                       model: "TempPurchaseOrder",
    //                    },
    //                    {
    //                       path: 'drink._id',
    //                       model: "Product",
    //                    },
    //                    {
    //                       path: 'product',
    //                       model: "Product",
    //                    },
    //                    {
    //                       path: 'user',
    //                       model: "User",
    //                   },
    //                   ],
    //        })
    
    //     if(!purchaseOrder){
    
    //         return res.status(400).json ({
    //             success : false,
    //             msg : `No se encontraron ordenes para el usuario ${user.firstName} ${user.lastName} `
    //         })
    //     }
    
    
       
    //     res.json({ 
    //         success : true,
    //         purchaseOrder
    
    //     });
        
    // } catch (error) {
    //     return res.status(500).json ({
    //         success : false,
    //         msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
    //     })

    // }

 
}





module.exports={
 createOrder,
    getOrder,
    editOrder

}