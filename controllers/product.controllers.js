


const {response} = require ('express');

const User = require ('../models/user');
const PurchaseOrder = require('../models/purchaseOrder');
const Product = require('../models/product');
const Employee = require('../models/employee');



const createProduct =  async (req, res = response) => {
    
     

    const { id }  = req.params;
    const { name, ...rest } = req.body

    // console.log(id);
    // console.log(req.body);

    //busco al usuario de la req por id
    let product = await Product.findById(id) || null;
    const employee = await Employee.findById(id) || null;

    if( employee == null){
        return res.status(400).json({
            success: false,
            msg: 'No se encuentra Empleado'
        })
    }

    if( employee.stateAccount == false){
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
           employee : employee._id,
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