


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const checkStatus  = require('../helpers/check-status');


const orderPost= async ( req , res ) => {
    
     const user = req.userAuth

     const {productID, ...rest}= req.body;
  
     const product = await Product.findById(productID) || null;
      
      if(!product){
        return res.status(400).json({
        success:false,
        msg: "Producto no encontrado en BD"
        })
      }
    
    const order = {
        user : user._id,
        addressDelivery : user.addressDelivery,
        product : product._id,
        price : product.price,
        // statusOrder,
        ...rest
    }

    const purchaseOrder =  new PurchaseOrder (order);

    purchaseOrder.save()

    res.status(200).json({
       success: true,
       purchaseOrder,
       product,
       user

    })


}




const getOrder= async ( req , res ) => {
    
    // const user = req.staffAuth

    // const { limite=5 , desde =0 }=req.query;

    const [ total, order] = await Promise.all([

        PurchaseOrder.countDocuments( {statusOrder : "RECEIVED"}),
        PurchaseOrder.find( {statusOrder : "RECEIVED"} )
            .populate('user')
            .populate('product')
         
    ])


   
    res.json({ 
        total,     
       order

    });
}


const editOrderStatus = async ( req , res ) => {
    
 
    try {
    
        // const { id } = req.params;
        const { status, date  } = req.body;
        // console.log(req.body);
        
        const staff = req.staffAuth

        // aca viene el id de orden de compra
        const { id } = req.params;
    
        // busco si la orden de compra existe        
        let purchaseOrder = await PurchaseOrder.findOne( {id} ) || null;

        
        if(purchaseOrder == null){
            return res.status(400).json({
                success:false,
                msg: "Orden de compra no encontrada"
            })
        }
        
        // busco si hay alguna orden q este en el proceso de "status"
        let purchaseOrderStatus = await PurchaseOrderStatus.findOne( {order : purchaseOrder._id} ) || null;
        
        // recibo el status en el body y lo evaluo
       const tempStatus = checkStatus(status);

        //   creo el objeto para guardar en BD  
        const orderEdit = {
            date : date,
            staff : staff._id,
            status : tempStatus    
        };

        let orderStatus;    

        if(purchaseOrderStatus !== null){
          console.log('id: ',purchaseOrderStatus._id);
            orderStatus = await PurchaseOrderStatus.findByIdAndUpdate( purchaseOrderStatus._id, { statusOrder : orderEdit, order : purchaseOrder._id } ,{new:true})
        //    console.log(orderStatus);
            return res.status(200).json({
                success : true,
                orderStatus
            })
        } 
          console.log('aca entra?');
            
         orderStatus = new PurchaseOrderStatus ({statusOrder : orderEdit, order : purchaseOrder._id })

         await orderStatus.save()

            return res.status(200).json({
                success : true,
                orderStatus
            })
     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al editar orden de compra'
        });
    }
    
  
}





module.exports={
    orderPost,
    getOrder,
    editOrderStatus

}