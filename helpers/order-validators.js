
const TempPurchaseOrder = require('../models/tempPurchaseOrder');

// esto es solo por si alguien pone en pausa un producto cuando cuando despues q q se genero la orden
// es decir como es una pwa puede q empieze el pedido y lo continue mas tarde o algo asi
// si lo hace en el momento la app solo se carga con productos q existen y q hay stock 
// en el front deberia eliminar los arreglos del SS y volver a cambiar todo OJO con esto

const orderValidator = async ( order )=>{

    let arrIDs = [];
    let tempArrIds = []; 
    
    tempArrIds = order.filter( item =>  item.tempOrder);
    tempArrIds.forEach( item => { arrIDs.push(item.tempOrder) });

    
    const tempOrder = await TempPurchaseOrder.find({_id : { $in: arrIDs }});

    // con esto valido si alguna bebida esta NO EXISTE en BD
    if(tempOrder){
        if(arrIDs.length !== tempOrder.length){
            throw new Error (`No existe en BD unas de las ordenes, invalidar pedido`)
        }
    }

    // con esto valido si alguna bebida estan sin stock o eliminada de la bD 

     const status= tempOrder.some (item => item.stock == false || item.statusOrder == false)

     if(status){

        const identify = tempOrder.filter(item => item.status == false)

        throw new Error (`Uno de las ordenes esta eliminada, invalidar pedido  ${identify}`)
     }


}




module.exports={
                orderValidator,
              
               }