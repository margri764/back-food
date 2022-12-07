




const auth = require('./auth.controllers');
const category = require('./category.controllers');
const emailCheck = require ('./emailCheck.controllers');
const employee = require ('./employee.controllers');
const order = require ('./order.controllers');
const product = require('../models/product');
const purchaseOrder = require ('./purchaseOrder.controllers');
const user = require ('./user.controllers');

module.exports={
    ...auth,
    ...category,
    ...emailCheck,
    ...employee,
    ...order,
    ...product,
    ...purchaseOrder,
    ...user,
}

