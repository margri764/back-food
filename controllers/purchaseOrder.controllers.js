


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
        
        await purchaseOrder.save()

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
    



      

     


}

// son las ordenes q ve el cliente en "ordenes en proceso", la orden de compra NO tiene su finished = true 
const getUserOrder= async ( req , res ) => {

    const user = req.userAuth
    
    try {
        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [ 
                        {
                          path: 'product',
                          model: "Product",
                        },
                        {
                          path: 'product._id',
                          model: "Product",
                        },
                        {
                          path: 'fries._id',
                          model: "Product",
                        },
                        {
                          path: 'drink',
                          model: "Product",
                        },
                        {
                          path: 'drink._id',
                          model: "Product",
                        },
                        {
                          path: 'user',
                          model: "User",
                        },
                      ],
           })
    
        // if(!purchaseOrder){
    
        //     return res.status(400).json ({
        //         success : false,
        //         msg : `No se encontraron ordenes para el usuario ${user.firstName} ${user.lastName} `
        //     })
        // }
    
    
       
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

// son las ordenes que recibe el dashboard para editar y demas
const getStaffOrder= async ( req , res ) => {

    const user = req.userAuth
    
    try {
        const purchaseOrder = await PurchaseOrder.find({ user: user._id }) 
        .populate( {
            path: 'order', 
            populate: [ 
                        {
                          path: 'product',
                          model: "Product",
                        },
                        {
                          path: 'product._id',
                          model: "Product",
                        },
                        {
                          path: 'fries._id',
                          model: "Product",
                        },
                        {
                          path: 'drink',
                          model: "Product",
                        },
                        {
                          path: 'drink._id',
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
    editOrder,
    getUserOrder,
    getStaffOrder,

}