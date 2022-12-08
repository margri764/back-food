

const {response} = require ('express');

const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');



const orderPost= async (req, res = response) => {
    
     

     const user = req.userAuth
  
    //NO HACE FALTA VERIFICAR MAS DATOS DEL USUARIO XQ EL CHECK TOKEN YA LO HACE
    // const user = await User.findById(userToken._id) || null;

    // if( user == null){
    //     return res.status(400).json({
    //         success: false,
    //         msg: 'Usuario no encontrado'
    //     })
    // }

        
    const order = {
        firstName : user.firstName,
        lastName : user.lastName,
        user : user._id,
        addressDelivery : user.addressDelivery,
        // employee : 
        // email : userToConfirm.email,
        // password : userToConfirm.password,
        // phone: userToConfirm.phone,
    }
    const purchaseOrder =  new PurchaseOrder (order);

        purchaseOrder.save()
        // if( user !== null){
        //     res.status(400).json({
        //         success:false,
        //         msg:"El Usuario ya existe en Base de Datos"
        //     })
        // }

    

    res.status(200).json({
        success: true,
        purchaseOrder

    })


}



module.exports={
    orderPost,

}