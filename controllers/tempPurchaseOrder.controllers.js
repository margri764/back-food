


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const { drinkValidator , friesValidator }  = require('../helpers/product-validators');


const createTempOrder = async ( req , res ) => {
    
     const user = req.userAuth

     try {

      const {productID, drink, fries, otherExpenses, ...rest}= req.body;

      //  guardo el plato principal
       const product = await Product.findById(productID) || null;
  
       
       //si llego hasta aca es xq ya paso por los helpers q controlan que las bebidas q vienen en la peticion esten en stock y existan. No hago mas valdiaciones xq en el peor de los casos vendra un array vacio y  propiedad otherExpenses quedara como un array vacio
  
       const tempDrink = await drinkValidator(drink);
       const tempFries = await drinkValidator(fries);


      //  lleno el array con los productos que vienen en la request
       const tempProductArray = []
       tempProductArray.push(tempDrink,tempFries)
  
  
      
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
      
     } catch (error) {

      return res.status(400).json({
        success: false,
        msg: "OOOps!!! algo salio mal al crear la orden temporal"
      })
      
     }
    
}









module.exports={
        createTempOrder

}