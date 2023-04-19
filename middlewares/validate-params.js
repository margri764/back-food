const Joi = require('joi');

// Define el esquema para los parámetros de tipo string
const stringSchema = Joi.string().trim().pattern(/^[A-Za-z0-9_\-]+$/);

// Función de orden superior para crear middlewares que validen y saniticen parámetros de tipo string
function validateStringParams(paramName) {
  return (req, res, next) => {
    const { error, value } = stringSchema.validate(req.params[paramName], { stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    req.params[paramName] = value;
    next();
  };
}

module.exports = { validateStringParams };
