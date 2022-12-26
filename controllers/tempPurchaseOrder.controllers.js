


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const { drinkValidator , friesValidator, getDrinkFromDB }  = require('../helpers/product-validators');


const createTempOrder = async ( req , res ) => {
    
     const user = req.userAuth

     try {

      const {productID, drink, fries, otherExpenses, ...rest}= req.body;

      //  guardo el plato principal
       const product = await Product.findById(productID) || null;

  
       
       //si llego hasta aca es xq ya paso por los helpers q controlan que las bebidas q vienen en la peticion esten en stock y existan. No hago mas valdiaciones xq en el peor de los casos vendra un array vacio y  propiedad otherExpenses quedara como un array vacio
       
      //  let tempDrink = drink;
       
      //  const arrDrinks = [];
      //  const arrQuantities = [];
      //  tempDrink.forEach( item => { arrQuantities.push( item.quantity ) });
       
      //  console.log(arrDrinks);
      //  console.log(arrQuantities);

       
      
      const tempOrder = {
          user : user,
          addressDelivery : user.addressDelivery,
          product : product,
          total : req.body.total,
          drink :drink,
          // fries : tempFries,
          // otherExpenses : tempProductArray,
          ...rest
      }
  
      // console.log("ORDER: ",tempOrder);
      const order =  new TempPurchaseOrder (tempOrder);
  
      order.save()
  
      res.status(200).json({
          success: true,
          order,
      })
      
     } catch (error) {

      return res.status(400).json({
        success: false,
        msg: "OOOps!!! algo salio mal al crear la orden temporal"
      })
      
     }
    
}



const getTempOrder = async ( req , res ) =>{
  
  const user = req.userAuth


  const tempOrder = await TempPurchaseOrder.find({user : user._id}).populate(["drink", "product"]) 
  // .populate("product")
  // console.log(tempOrder);
  
  // const drink = getDrinkFromDB(tempOrder)

   
  


  return res.status(200).json({
    success: true,
    tempOrder 
   
  })

}





module.exports={
        createTempOrder,
        getTempOrder

}