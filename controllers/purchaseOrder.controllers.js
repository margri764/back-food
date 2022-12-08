

const {response} = require ('express');

const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');



const orderPost= async (req, res = response) => {
    
     

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
        price : product.price
        // employee : 
        // email : userToConfirm.email,
        // password : userToConfirm.password,
        // phone: userToConfirm.phone,
    }
    const purchaseOrder =  new PurchaseOrder (order);

        purchaseOrder.save()
        // if( user !== null){
        //     res.status(400).json({
        //         success:false,
        //         msg:"El Usuario ya existe en Base de Datos"
        //     })
        // }

    

    res.status(200).json({
        success: true,
        purchaseOrder

    })


}



module.exports={
    orderPost,

}