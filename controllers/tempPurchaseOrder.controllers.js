


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const Product = require('../models/product');
const updateStock = require('../helpers/stock-managment');


const createTempOrder = async ( req , res ) => {
    
     const user = req.userAuth

     try {

      const {productID, drink, fries, otherExpenses, customMenu,  ...rest}= req.body;
  
      let productIDs = [];
 
          productID.forEach((product) => {
          productIDs.push( {_id:product._id, quantity : product.quantity} ); 
          });
          
          drink.forEach((drink) => {
          productIDs.push( {_id:drink._id, quantity : drink.quantity} );
          });

          fries.forEach((fries) => {
          productIDs.push( {_id:fries._id, quantity : fries.quantity} );
          });


          // controlo si hay stock de esos productos
          for (let i = 0; i < productIDs.length; i++) {
            const item = productIDs[i];
             await updateStock(item);

          }
      
      const tempOrder = {
          user    : user,
          product : productID,
          drink   : drink,
          fries   : fries,
          total   : req.body.total,
          customMenu : customMenu, 
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

      console.log('Error desde CreateTempOrder: ', error);
      let errorMessage = 'Ooops algo salio mal al crear la orden';
    
      // Verificamos si el error es específico generado en la condición "if"
      if (error.message.includes('No hay suficiente stock disponible para el producto')) {
        errorMessage = error.message;
      }
        return res.status(500).json({
            success: false,
            msg: errorMessage
        })

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
        .populate([ 
             "user",
                {
                  path: 'product', 
                  populate: { 
                    path: '_id',
                    model: "Product",
                          },
                  },
                  {
                  path: 'drink', 
                  populate: { 
                    path: '_id',
                    model: "Product",
                           },
                  },
                  {
                    path: 'fries', 
                    populate: { 
                      path: '_id',
                      model: "Product",
                             },
                    }
              ])
        

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

const delTempOrderIfNoStock= async (req, res) => {
 
  try {
  
     const arrIds  = req.params;
    console.log('desde delTempOrder',arrIds);
     let tempIDS= [];
     let tempID ;

        // controlo si hay stock de esos productos
        for (let i = 0; i < arrIds.length; i++) {
        const id = arrIds[i];
        tempID= await checkIfExistTempOrder(id);
        tempIDS.push(tempID)

        console.log(tempIDS);
      }

    //  await TempPurchaseOrder.deleteMany({ _id: { $in: tempIDS } });
   
   
    //  res.json({ 
    //    success: true,
    //    msg: "Orden eliminada correctamente",      
    //  });

  
  } catch (error) {

    console.log('Error desde delTempOrderIfNoStock: ', error);
    let errorMessage = 'Ooops algo salio mal al intentar eliminar ordenes temporales';
  
    if (error.message.includes('No se encuentra la order Temporal para ser eliminada')) {
      errorMessage = error.message;
    }
      return res.status(500).json({
          success: false,
          msg: errorMessage
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
        deleteManyTempOrder,
        delTempOrderIfNoStock

}