


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const checkProduct  = require('../helpers/check-product');


const createTempOrder = async ( req , res ) => {
    
     const user = req.userAuth

     const {productID, drink, fries, otherExpenses, ...rest}= req.body;

     const product = await Product.findById(productID) || null;

    if(product){

// verifico si viene algun producto como papas fritas o bebidas (drink y fries)
     const tempProductArray = []

     if(drink._id){

      // const tempDrink = await Product.findById(drink._id) || null
      // const tempDrink =  checkProduct(drink._id)

      // if(tempDrink){
      //     tempProductArray.push(tempDrink);
      //   }
     }

    //  if(fries._id){
    //   tempProductArray.push(fries)
    //  }
    }else{
      return res.status(400).json({
        success : false,
        msg: "Producto no encontrado en BD"
      })
    }

    

// Con product estoy manejando el plato principal
    
  
    
    const tempOrder = {
        user : user,
        addressDelivery : user.addressDelivery,
        product : product,
        total : req.body.total,
        otherExpenses : tempProductArray,
        ...rest
    }

    // console.log("ORDER: ",tempOrder);
    const order =  new TempPurchaseOrder (tempOrder);

    order.save()

    res.status(200).json({
        success: true,
        order
    })
    //    success: true,
    //    purchaseOrder,
    //    product,
    //    user

    // })


}









module.exports={
        createTempOrder

}