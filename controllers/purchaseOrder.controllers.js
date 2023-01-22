


const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const PurchaseOrderStatus = require('../models/purchaseOrderStatus');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const checkStatus  = require('../helpers/check_status');

// es la orden q se crea al momento de comprar
const createOrder= async ( req , res ) => {
    
    try {

        const user = req.userAuth
        const { order, ...rest }= req.body;

        // console.log(req.body);

        let arrIDs = [];
        let tempTotal = [];
        
         order.forEach( item => arrIDs.push(item._id));
        // tempArrIds.forEach( item => { arrIDs.push(item.tempOrder) });

        tempTotal = order.filter( item =>  item.total);
        tempTotal.forEach( item => { total = item.total });

        let orderIds = await TempPurchaseOrder.find({_id : { $in: arrIDs }})

            await TempPurchaseOrder.updateMany(
                { user : user._id}, //QUERY para decirle que campo debe editar
                {"$set":{"statusOrder": "COMPLETE"}},   // le paso el valor de reemplazo
                ) //Filtra los documentos que quieres actualizar
         
        
        orderIds.map((item)=>{
            console.log("from: ", item.statusOrder) 
            
        })

        //   coloco en duro el id de un miembro del staff q no tiene datos, es solo para pasar la validacion del Schema de la PurchseOrden      
        const orderEdit = {
            date : new Date(),
            staff : "63c01974ce563614ab679aaa",
            status : 'SIN PROCESAR'    
        };


        const tempOrder = {
            user : user._id,
            addressDelivery : user.addressDelivery,
            order : orderIds,
            total : total,
            statusOrder: orderEdit,
            finished: false,
            ...rest
        }

        // aca grabo la orden de compra del cliente 
        const purchaseOrder =  new PurchaseOrder (tempOrder);
        
        /* en este caso guardo la misma orden pero en otra coleccion para poder registrar los cambio de estados
           y la persona q esta realizando los cambios */ 

           
          await purchaseOrder.save()

        //    const tempOrderStatus = {
        //     user : user._id,
        //     addressDelivery : user.addressDelivery,
        //     order : purchaseOrder._id,
        //     total : total,
        //     ...rest
        // }


        // const purchaseOrderStatus =  new PurchaseOrderStatus (tempOrderStatus);
        // await purchaseOrderStatus.save()

        res.status(200).json({
        success: true,
        purchaseOrder,

        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            msg: 'Ooops algo salio mal al crear la orden'
        })
        
    }
    



      

     
    // if(!product){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto no encontrado en BD"
    //     })
    //   }

    //   if(product.status != true){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto dado de baja en BD"
    //     })
    //   }

    //   if(product.stock != true){
    //     return res.status(400).json({
    //     success:false,
    //     msg: "Producto sin stock"
    //     })
    //   }
    



}

// son las ordenes en proceso e historicas q puede ver el cliente
const getOrder= async ( req , res ) => {
    
    const user = req.userAuth

    try {

        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [{ 
                          path: 'drink',
                          model: "TempPurchaseOrder",
                       },
                       {
                          path: 'drink._id',
                          model: "Product",
                       },
                       {
                          path: 'product',
                          model: "Product",
                       },
                       {
                          path: 'user',
                          model: "User",
                      },
                      ],
           })
    
        if(!purchaseOrder){
    
            return res.status(400).json ({
                success : false,
                msg : `No se encontraron ordenes para el usuario ${user.firstName} ${user.lastName} `
            })
        }
    
    
       
        res.json({ 
            success : true,
            purchaseOrder
    
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar obtener las ordenes de compra `
        })

    }

 
}

// creo q no va xq tengo la "editOrderStatus en StaffOrder.controller"
const editOrder= async ( req , res ) => {
    try {

    const {id, status} = req.body

    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(id,{statusOrder: status},{new:true})


    if(!purchaseOrder){

        return res.status(400).json({
            success : false,
            msg: "No existe la orden q se intenta editar"
        })

    }

        res.json({ 
            success : true,
        });
        
    } catch (error) {
        return res.status(500).json ({
            success : false,
            msg : `Ooops algo salió mal al intentar editar el estado de la orden `
        })

    }
 
}





module.exports={
    createOrder,
    getOrder,
    editOrder

}