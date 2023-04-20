const Joi = require('joi');
const mongoose = require('mongoose');

const purchaseOrderSchema = Joi.object({
  _id: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message('El ID del usuario no es válido');
    }
    return value;
  }).required(),

  user: Joi.object({
    _id: Joi.string().required(),
    user_login: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    role: Joi.string().required(),
    addressDelivery: Joi.string(),
    addressFavorite: Joi.string(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    google: Joi.boolean().required(),
    stateAccount: Joi.boolean().required(),
  }).required(),

  product: Joi.array().items(
    Joi.object({
      quantity: Joi.number().required(),
      _id: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().required(),
        img: Joi.string().required(),
        ingredients: Joi.string().required(),
        paused: Joi.boolean().required(),
        staff: Joi.string().required(),
        status: Joi.boolean().required(),
        stock: Joi.boolean().required(),
        stockQuantity: Joi.number().required(),
        updatedAt: Joi.date().required()
      }).required()
    }).required()
  ).required(),

  statusOrder: Joi.string().required(),
  status: Joi.boolean().required(),

  drink: Joi.array().items(
    Joi.object({
      quantity: Joi.number().required(),
      _id: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().required(),
        img: Joi.string().required(),
        ingredients: Joi.string().required(),
        paused: Joi.boolean().required(),
        staff: Joi.string().required(),
        status: Joi.boolean().required(),
        stock: Joi.boolean().required(),
        stockQuantity: Joi.number().required(),
        updatedAt: Joi.date().required()
      }).required()
    }).required()
  ).required(),

  fries: Joi.array().items(
    Joi.object({
      quantity: Joi.number().required(),
      _id: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().required(),
        img: Joi.string().required(),
        ingredients: Joi.string().required(),
        paused: Joi.boolean().required(),
        staff: Joi.string().required(),
        status: Joi.boolean().required(),
        stock: Joi.boolean().required(),
        stockQuantity: Joi.number().required(),
        updatedAt: Joi.date().required()
      }).required()
    }).required()
  ).required(),

  customMenu: Joi.array().items(Joi.string()),

  total: Joi.number().required(),
  otherExpenses: Joi.array().items(Joi.string()),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required()
});

// const purchaseOrderSchema = Joi.object({
//   order: Joi.array().items(orderSchema).min(1).required(),
//   total: Joi.number().required()
// });

module.exports = { purchaseOrderSchema };
