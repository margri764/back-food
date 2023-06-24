const Joi = require('joi');
const mongoose = require('mongoose');

const staffSchema = Joi.object({
    
    fullName: Joi.string().required().messages({
      'any.required': 'El nombre del staff es obligatorio y tiene que ser un string',
      'string.empty': 'El nombre del staff no puede estar vacío',
      'string.base':  'El nombre del staff debe ser un string'
    }),
    email: Joi.string().regex(/^[^@]+$/).required().messages({
        'any.required': 'El email es obligatorio',
        'string.empty': 'El email no puede estar vacío',
        'string.pattern.base': 'El email no puede contener "@"'
      }),
    phone: Joi.string().min(10).regex(/^[1-9][0-9]{9}$/).messages({
        'any.required': 'El telefono del staff es obligatorio y tiene que ser un string',
        'string.empty': 'El telefono del staff no puede estar vacío',
        'string.base':  'El telefono del staff debe ser un string de 10 digitos y no puede empezar con 0'
      }),

    address: Joi.string().max(50),

    password: Joi.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required().messages({
        'any.required': 'El password del staff es obligatorio y tiene que ser un string',
        'string.empty': 'El password del staff no puede estar vacío',
        'number.base': 'El apellido del usuario debe ser un string',
        'string.min': 'El password del usuario debe tener al menos 8 caracteres',
        'string.pattern.base': 'El password debe contener al menos una letra y un número'
    }),
    role: Joi.string().valid('STAFF_ROLE', 'ADMIN_ROLE', 'SUPER_ROLE').required().messages({
        'any.required': 'El rol del usuario es obligatorio y tiene que ser un string',
        'string.empty': 'El rol del usuario no puede estar vacío',
        'any.only': 'El rol del usuario debe ser USER_ROLE, ADMIN_ROLE o SUPER_ROLE'
    })
    
});

const staffUpdateSchema = Joi.object({

    _id: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message('No es un ID mongo');
        }
        return value;
    }).required(),
    
    fullName: Joi.string().required().messages({
      'any.required': 'El nombre del staff es obligatorio y tiene que ser un string',
      'string.empty': 'El nombre del staff no puede estar vacío',
      'string.base':  'El nombre del staff debe ser un string'
    }),

    email: Joi.string().regex(/^[^@]+$/).required().messages({
        'any.required': 'El email es obligatorio',
        'string.empty': 'El email no puede estar vacío',
        'string.pattern.base': 'El email no puede contener "@"'
    }),
    phone: Joi.string().min(10).regex(/^[1-9][0-9]{9}$/).allow('').messages({
        'any.required': 'El telefono del staff es obligatorio y tiene que ser un string',
        'string.empty': 'El telefono del staff no puede estar vacío',
        'string.base':  'El telefono del staff debe ser un string de 10 digitos y no puede empezar con 0'
    }),

    address: Joi.string().max(50).allow(''),

    role: Joi.string().valid('STAFF_ROLE', 'ADMIN_ROLE', 'SUPER_ROLE').required().messages({
        'any.required': 'El rol del usuario es obligatorio y tiene que ser un string',
        'string.empty': 'El rol del usuario no puede estar vacío',
        'any.only': 'El rol del usuario debe ser USER_ROLE, ADMIN_ROLE o SUPER_ROLE'
    }),
});

module.exports = { staffSchema, staffUpdateSchema };