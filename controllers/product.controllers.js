


const {response} = require ('express');

const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const Staff = require('../models/staff');



const createProduct =  async (req, res = response) => {
    
    // const { id }  = req.params;
    const { name, ...rest } = req.body
    const user = req.staffAuth;


    //busco si el producto ya esta creado lo q puedo usar es el nombre
    let product = await Product.findOne({name : name}) || null;
    console.log(product);

    const staff = await Staff.findById(user._id) || null;



    if( staff == null){
        return res.status(400).json({
            success: false,
            msg: 'No se encuentra Empleado'
        })
    }

    if( staff.stateAccount == false){
        return res.status(400).json({
            success: false,
            msg: 'Empleado eliminado o suspendido, hable con encargado'
         })
    }
    

    if( product != null){
        return res.status(400).json({
            success: false,
            msg: 'Producto ya cargado'
        })
    }


    
    const tempProduct = {
        ...rest,
           staff : staff._id,
           name 
    }

    product =  new Product (tempProduct);

    product.save()

    res.status(200).json({
        success: true,
        product

    })


}



module.exports={
    createProduct,

}