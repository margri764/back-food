


const {response} = require ('express');

const User = require ('../models/user');
const StatusPurchaseOrder = require('../models/statusPurchaseOrder');
const Product = require('../models/product');



const statusPurchaseOrderPost= async (req, res = response) => {
    
     try {
        
   
 
     const staff = req.staffAuth

    //  const {productID, ...rest}= req.body;
  
    //   const product = await Product.findById(productID) || null;
      
    //   if(!product){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto no encontrado en BD"
    //     })
    //   }
    
    
    const statusOrder = {
        staff : staff._id,
        // addressDelivery : user.addressDelivery,
        // product : product._id,
        // price : product.price
        // employee : 
        // email : userToConfirm.email,
        // password : userToConfirm.password,
        // phone: userToConfirm.phone,
    }

    const statusPurchaseOrder =  new StatusPurchaseOrder (statusOrder);

        statusPurchaseOrder.save()
        // if( user !== null){
        //     res.status(400).json({
        //         success:false,
        //         msg:"El Usuario ya existe en Base de Datos"
        //     })
        // }

    

    res.status(200).json({
        success: true,
        statusPurchaseOrder

    })

} catch (error) {
        
    console.log(error);
    return res.status(500).json({
        success: false,
        msg: 'Se produjo un error, hable con el administrador'
    });

}


}



module.exports={
    statusPurchaseOrderPost,

}