
const Product = require('../models/product');
const tempPurchaseOrder = require('../models/tempPurchaseOrder');

// esto es solo por si alguien pone en pausa un producto cuando cuando despues q q se genero la orden
// es decir como es una pwa puede q empieze el pedido y lo continue mas tarde o algo asi
// si lo hace en el momento la app solo se carga con productos q existen y q hay stock 
// en el front deberia eliminar los arreglos del SS y volver a cambiar todo OJO con esto

const mainProdValidator = async ( product )=>{
    
    const arrIDs = [];

      product.forEach( item => { arrIDs.push(item._id) });
    
        const productVal = await Product.find({_id : { $in: arrIDs }});
        // con esto valido si alguna bebida esta NO EXISTE en BD
        if(productVal){
            if(arrIDs.length !== productVal.length){
                throw new Error (`No existe el producto principal, invalidar pedido y forzar reload de productos en el front`)
            }
        }

    // con esto valido si alguna bebida estan sin stock o eliminada de la bD 

     const status= productVal.some (item => item.stock == false || item.status == false)

     if(status){

        const identifyNoStock = productVal.filter(item => item.stock == false || item.status == false);
        let product;
        identifyNoStock.forEach( (element) => {product = element.name })
        throw new Error (`El producto ${product} se encuentra sin stock. Disculpe las molestias.`)
     }
}

const drinkValidator = async ( drink )=>{

    if(drink.length == 0) { return } // si no vienen bebidas q no se siga ejecutando

    const arrIDs = [];

      drink.forEach( item => { arrIDs.push(item._id) });

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
        if(status){

            const identifyNoStock = product.filter(item => item.stock == false || item.status == false);
            let product;
            identifyNoStock.forEach( (element) => {product = element.name })
            throw new Error (`El producto ${product} se encuentra sin stock. Disculpe las molestias.`)
         }
     }



}


const friesValidator = async ( fries ) => {

    if(fries.length == 0) { return } // si no vienen papas q no se siga ejecutando


    const arrIDs= [] 
    fries.forEach( item => { arrIDs.push(item._id)});
    
    const product = await Product.find({_id : {$in: arrIDs}})


    if(product){

        if(arrIDs.length !== product.length){
            throw new Error (`No existe en BD uno de los productos, invalidar pedido y forzar reload de productos en el front`)
        }
    }

     const status= product.some (item => item.stock == false || item.status == false)

     if(status){
        if(status){
            const identifyNoStock = productVal.filter(item => item.stock == false || item.status == false);
            let product;
            identifyNoStock.forEach( (element) => {product = element.name })
            throw new Error (`El producto ${product} se encuentra sin stock. Disculpe las molestias.`)
         }
     }


}

const getDrinkFromDB = async ( order )=>{

//    console.log("order from DB: ", order);
    let tempArrDrink = [];
    let arrDrink = [];

    tempArrDrink = order.map( (elem, i) => ({
        ...elem,
         new: elem.new= elem.drinkQuantity[i]
      }));
console.log(tempArrDrink);
      return tempArrDrink

    }

const checkTempOrdBeforeDelProduct = async ( productId)=>{

    const arrIDs = [];

    drink.forEach( item => { arrIDs.push(item._id) });

    
    const product = await tempPurchaseOrder.find({_id : { $in: arrIDs }});

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


module.exports={
                drinkValidator,
                friesValidator,
                getDrinkFromDB,
                mainProdValidator,
                checkTempOrdBeforeDelProduct
               }