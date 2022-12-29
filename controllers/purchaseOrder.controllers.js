


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

        console.log(req.body);

        let arrIDs = [];
        let tempArrIds = []; 
        let tempTotal = [];
        
        tempArrIds = order.filter( item =>  item.tempOrder);
        tempArrIds.forEach( item => { arrIDs.push(item.tempOrder) });

        tempTotal = order.filter( item =>  item.total);
        tempTotal.forEach( item => { total = item.total });

        const orderIds = await TempPurchaseOrder.find({_id : { $in: arrIDs }});

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

        return res.status(400).json({
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


    const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
          path: 'order', 
          populate: [{ 
                        path: 'drink',
                        model: "TempPurchaseOrder",
                     },{
                        path: 'drink._id',
                        model: "Product",
                     }
                    ],
         })


   
    res.json({ 
        purchaseOrder

    });
}







module.exports={
 createOrder,
    getOrder,

}