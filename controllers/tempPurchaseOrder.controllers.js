const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const {checkIfExistTempOrder, updateStockFromTempOrder} = require('../helpers/stock-managment');
const _ = require('lodash');


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


          /* controlo si hay stock de esos productos. Si uno de los productos esta sin stock en el front se hace la redireccion al home
          para q elija otra opcion */
          for (let i = 0; i < productIDs.length; i++) {
            const item = productIDs[i];
             await updateStockFromTempOrder(item);
          }

      
      const tempOrder = {
          user: user._id,
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
  
      return res.status(200).json({
          success: true,
          order,
      })
      
     } catch (error) {

      console.log('Error desde CreateTempOrder: ', error);
      let errorMessage = 'Ups algo salió mal, hable con el administrador';
 
        return res.status(500).json({
            success: false,
            msg: errorMessage
        })
 
     }
    
}

const getTempOrder = async ( req , res ) =>{
  
  const user = req.userAuth

try {
  
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
    
    console.log('Error desde getTempOrder ', error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';
    return res.status(500).json({
      success: false,
      msg: errorMessage
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
   
     res.status(200).json({ 
       success: true,
       msg: "Orden eliminada correctamente",      
       tempPurchaseOrder
   
     });

  
  } catch (error) {

    console.log('desde: deleteTempOrder: ', error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';
    
    return res.status(500).json({
      success: false,
      msg: errorMessage
    })
    
  }
  
}

const delTempOrderIfNoStock= async (req, res) => {
 
  try {
  
     const ids  = req.query.ids[0].split(',');
     let tempIDS= [];
     let tempID ;
     
        // controlo si hay stock de esos productos
        for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        tempID= await checkIfExistTempOrder(id);
        tempIDS.push(tempID)
      }

     await TempPurchaseOrder.deleteMany({ _id: { $in: tempIDS } });
   
   
     return res.status(200).json({ 
       success: true,
       msg: "Orden eliminada correctamente",      
     });

  
  } catch (error) {

    console.log('Error desde delTempOrderIfNoStock: ', error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';
  
    if (error.message === 'No se encuentra la order Temporal para ser eliminada') {
      errorMessage = error.message;
    }
      return res.status(500).json({
          success: false,
          msg: errorMessage
      })
  }
  
}

const deleteManyTempOrder= async (req, res) => {
 
  try {

    // la idea de q este metodo es eliminar todos las ordenes temporales,   

         await TempPurchaseOrder.deleteMany()
      
        res.status(200).json( {
          success: true, 
          msg: `Se elimiaron correctamente todas las ordenes temporales` 
        } );  
      
    
    } catch (error) {
      console.log('error desde deleteManyTempOrder: ', error);
      let errorMessage = 'Ups algo salió mal, hable con el administrador';
    
      return res.status(500).json({
        success: false,
        msg: errorMessage
      })
    }
  
}


module.exports={
        createTempOrder,
        getTempOrder,
        deleteTempOrder,
        deleteManyTempOrder,
        delTempOrderIfNoStock,
}