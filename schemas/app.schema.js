const Joi = require('joi');

const hourlySchema = Joi.object({
  hour: Joi.string().regex(/^\d{2}:\d{2} - \d{2}:\d{2}$/).required().messages({
    'any.required': 'El horario es obligatorio y tiene que ser un string con el formato 10:00 - 14:00',
    'string.empty': 'El horario no puede estar vacío',
    'string.pattern.base': 'El horario tiene que ser un string con el formato 10:00 - 14:00'
  }),
    day: Joi.array().items(Joi.number().strict()).required(),
    status: Joi.boolean().strict().required(),
  });

module.exports = { hourlySchema };