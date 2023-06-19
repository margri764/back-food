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

    stockQuantity: Joi.number().optional().messages({
      'any.required': 'El stock del producto es obligatorio',
      'number.base': 'El stock del producto debe ser un número'
    }),

    comment: Joi.string().default(''),
    ingredients: Joi.string().default('')
});

const productUpdateSchema = Joi.object({
    name: Joi.string().optional().messages({
      'any.required': 'El nombre del producto es obligatorio y tiene que ser un string',
      'string.empty': 'El nombre del producto no puede estar vacío',
      'string.base': 'El nombre del producto debe ser una cadena'
    }),

    price: Joi.number().optional().messages({
      'any.required': 'El precio del producto es obligatorio',
      'number.base': 'El precio del producto debe ser un número mayor a 0 y sin "-" ',
    }),

    stockQuantity: Joi.number().optional().messages({
      'any.required': 'El stock del producto es obligatorio',
      'number.base': 'El stock del producto debe ser un número'
    }),

    comment: Joi.string().default(''),
    ingredients: Joi.string().default('')
});

const operationSchema = Joi.object({

  value: Joi.number().required().messages({
    'any.required': 'El valor de la operación es obligatorio',
    'number.base': 'El valor de la operación debe ser un número'
  }),

  category: Joi.string().required().messages({
    'any.required': 'El nombre de la categoria es obligatorio',
    'number.base': 'El nombre de la categoria tiene que ser un string'
  }),

  operation: Joi.string().required().messages({
    'any.required': 'La operación a realizar es obligatorio',
    'number.base': 'El nombre de la operación tiene que ser un string'
  }),

});


module.exports = {
                  productSchema,
                  productUpdateSchema,
                  operationSchema,
                };