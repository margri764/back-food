const Joi = require('joi');

const signUpSchema = Joi.object({
    
    firstName: Joi.string().required().messages({
      'any.required': 'El nombre del usuario es obligatorio y tiene que ser un string',
      'string.empty': 'El nombre del usuario no puede estar vacío',
      'string.base': 'El nombre del usuario debe ser un string'
    }),

    lastName: Joi.string().required().messages({
      'any.required': 'El apellido del usuario es obligatorio y tiene que ser un string',
      'string.empty': 'El apellido del usuario no puede estar vacío',
      'number.base': 'El apellido del usuario debe ser un string'
    }),

    phone: Joi.string().default(''),
    
    email: Joi.string().email().required(),

    password: Joi.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required().messages({
        'any.required': 'El password del usuario es obligatorio y tiene que ser un string',
        'string.empty': 'El apellido del usuario no puede estar vacío',
        'number.base': 'El apellido del usuario debe ser un string',
        'string.min': 'El password del usuario debe tener al menos 8 caracteres',
        'string.pattern.base': 'El password debe contener al menos una letra y un número'
    }),

});

const userUpdateSchema = Joi.object({
    
  firstName: Joi.string().required().messages({
    'any.required': 'El nombre del usuario es obligatorio y tiene que ser un string',
    'string.empty': 'El nombre del usuario no puede estar vacío',
    'string.base': 'El nombre del usuario debe ser un string'
  }),

  lastName: Joi.string().required().messages({
    'any.required': 'El apellido del usuario es obligatorio y tiene que ser un string',
    'string.empty': 'El apellido del usuario no puede estar vacío',
    'number.base': 'El apellido del usuario debe ser un string'
  }),

  phone: Joi.string().default(''),
  
  email: Joi.string().email().required(),

  addressFavorite: Joi.string(),
});



module.exports = { signUpSchema, userUpdateSchema };