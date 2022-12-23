
const Product = require('../models/product');



// esto es solo por si alguien pone en pausa un producto cuando cuando despues q q se genero la orden
// es decir como es una pwa puede q empieze el pedido y lo continue mas tarde o algo asi
// si lo hace en el momento la app solo se carga con productos q existen y q hay stock 
// en el front deberia eliminar los arreglos del SS y volver a cambiar todo OJO con esto




const drinkValidator = async ( drink )=>{


    const arrIDs= [] 
    drink.forEach( item => { arrIDs.push(item._id)});
    
    const product = await Product.find({_id : {$in: arrIDs}})


    // con esto valido si alguna bebida esta NO EXISTE en BD
    if(product){

        if(arrIDs.length !== product.length){
            throw new Error (`No existe en BD unas de las papas, invalidar pedido y forzar reload de productos en el front`)
        }
    }

    // con esto valido si alguna bebida estan sin stock o eliminada de la bD 

     const status= product.some (item => item.stock == false || item.status == false)

     if(status){

        const identify = product.filter(item => item.stock == false || item.status == false)

        throw new Error (`Uno de los productos esta eliminado, sin stock o PAUSA, invalidar pedido y forzar reload de productos en el front ${identify}`)
     }
  
     return product;
}

const friesValidator = async ( fries )=>{


    const arrIDs= [] 
    fries.forEach( item => { arrIDs.push(item._id)});
    
    const product = await Product.find({_id : {$in: arrIDs}})


    // con esto valido si alguna bebida esta NO EXISTE en BD
    if(product){

        if(arrIDs.length !== product.length){
            throw new Error (`No existe en BD uno de los productos, invalidar pedido y forzar reload de productos en el front`)

        }
    }

    // con esto valido si alguna bebida estan sin stock o eliminada de la bD 

     const status= product.some (item => item.stock == false || item.status == false)

     if(status){

        const identify = product.filter(item => item.stock == false || item.status == false)

        throw new Error (`Uno de los productos esta eliminado, sin stock o PAUSA, invalidar pedido y forzar reload de productos en el front ${identify}`)
     }


}


module.exports={
                drinkValidator,
                friesValidator
               }