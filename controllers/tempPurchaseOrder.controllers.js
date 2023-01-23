


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');


const createTempOrder = async ( req , res ) => {
    
     const user = req.userAuth

     try {

      const {productID, drink, fries, otherExpenses, ...rest}= req.body;

      //  guardo el plato principal
       const product = await Product.findById(productID) || null;

       
       //si llego hasta aca es xq ya paso por los helpers q controlan que las bebidas q vienen en la peticion esten en stock y existan. No hago mas valdiaciones xq en el peor de los casos vendra un array vacio y  propiedad otherExpenses quedara como un array vacio
       
      
      const tempOrder = {
          user : user,
          addressDelivery : user.addressDelivery,
          product : product,
          total : req.body.total,
          drink :drink,
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

      return res.status(500).json({
        success: false,
        msg: "OOOps!!! algo salio mal al crear la orden temporal"
      })
      
     }
    
}

const getTempOrder = async ( req , res ) =>{
  
  const user = req.userAuth

try {
  // ,{statusOrder : "INCOMPLETE"}
  const tempOrder = await TempPurchaseOrder.find({
    $and:[
          { user: user._id },
          { statusOrder : "INCOMPLETE"}
        ]})
        .populate([ "product","user",{
                  path: 'drink', 
                  populate: { 
                    path: '_id',
                    model: "Product",
                           },
         }])
        

  return res.status(200).json({
    success: true,
    tempOrder
   
  })



  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Oooops no se pudo obtener las ordenes de compra desde la BD'
    })
  }
}

const deleteTempOrder= async (req, res) => {
 
  try {
  
     const { id } = req.params;
   
     const tempPurchaseOrder = await TempPurchaseOrder.findByIdAndDelete( id );
   
     if(!tempPurchaseOrder){
         return res.status(400).json({
           success: false,
           msg: "Orden no encontrada"
         })
     }
   
     res.json({ 
       success: true,
       msg: "Orden eliminada correctamente",      
       tempPurchaseOrder
   
     });

  
  } catch (error) {

    console.log('desde: deleteTempOrder: ', error);
    
    return res.status(500).json({
      success: false,
      msg: "OOps algo salio mal al intentar eliminar una orden temporal"
    })
    
  }
  
}

const tempOrderEdit= async (req, res) => {
 

  const {id, ...rest} = req.body

  const tempPurchaseOrder = await TempPurchaseOrder.findByIdAndUpdate( id, rest, {new:true} );

  if(tempPurchaseOrder) {
        res.json({ 
          success: true,
          msg: "Orden editada correctamente",      
          tempPurchaseOrder

        });
  }else{
    return res.status(400).json({
      success: false,
      msg: "Orden no encontrada"
    })
  }
}

const deleteManyTempOrder= async (req, res) => {
 
  try {

    // la idea de q este metodo es eliminar todos las ordenes temporales,   

         await TempPurchaseOrder.deleteMany()
      
        res.json( {
          success: true, 
          msg: `Se elimiaron correctamente todas las ordenes temporales` 
        } );  
      
    
    } catch (error) {
      console.log('error desde deleteManyTempOrder: ', error);
    
      return res.status(500).json({
        success: false,
        msg: "Oops algo salió mal al intentar eliminar tosas las ordenes temporales"
      })
    }
  
}

module.exports={
        createTempOrder,
        getTempOrder,
        deleteTempOrder,
        tempOrderEdit,
        deleteManyTempOrder

}