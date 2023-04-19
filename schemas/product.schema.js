const Joi = require('joi');

    
const productSchema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'El nombre del producto es obligatorio y tiene que ser un string',
      'string.empty': 'El nombre del producto no puede estar vacío',
      'string.base': 'El nombre del producto debe ser una cadena'
    }),
    price: Joi.number().required().messages({
      'any.required': 'El precio del producto es obligatorio',
      'number.base': 'El precio del producto debe ser un número'
    }),
    comment: Joi.string().default(''),
    ingredients: Joi.string().default('')
  });
  
  module.exports = productSchema;
  