
const Product = require('../models/product');

// esto es solo por si alguien pone en pausa un producto cuando cuando despues q q se genero la orden
// es decir como es una pwa puede q empieze el pedido y lo continue mas tarde o algo asi
// si lo hace en el momento la app solo se carga con productos q existen y q hay stock 
// en el front deberia eliminar los arreglos del SS y volver a cambiar todo OJO con esto

const drinkValidator = async ( drink )=>{

    const arrIDs = [];

      drink.forEach( item => { arrIDs.push(item._id) });
    //   drink.forEach( item => { arrQuantities.push(item.quantity) });

    
    const product = await Product.find({_id : { $in: arrIDs }});

    // con esto valido si alguna bebida esta NO EXISTE en BD
    if(product){
        if(arrIDs.length !== product.length){
            throw new Error (`No existe en BD unas de las bebidas, invalidar pedido y forzar reload de productos en el front`)
        }
    }

    // con esto valido si alguna bebida estan sin stock o eliminada de la bD 

     const status= product.some (item => item.stock == false || item.status == false)

     if(status){

        const identify = product.filter(item => item.stock == false || item.status == false)

        throw new Error (`Uno de los productos esta eliminado, sin stock o PAUSA, invalidar pedido y forzar reload de productos en el front ${identify}`)
     }



}


const friesValidator = async ( fries ) => {



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

const getDrinkFromDB = async ( order )=>{

//    console.log("order from DB: ", order);
    let tempArrDrink = [];
    let arrDrink = [];

        //  const productAndQuantity = product.map( (item, i) =>({ 
    //       ...item, 
    //      newQ : item.newQ =  arrQuantities[i]
         
    //     }))

    tempArrDrink = order.map( (elem, i) => ({
        ...elem,
         new: elem.new= elem.drinkQuantity[i]
      }));
console.log(tempArrDrink);
      return tempArrDrink

    //   const biArray = [
    //     [1, 2, 3],
    //     [4, 5, 6],
    //     [7, 8, 9],
    //   ];
    //   biArray.forEach(element => {
    //     element.forEach(elem => {
    //       console.log(elem);
    //     });
    //   });


    // quiero ver si puedo acceder a los _id de las ordenes guardadas



 
  
}


module.exports={
                drinkValidator,
                friesValidator,
                getDrinkFromDB
               }