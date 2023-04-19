const Joi = require('joi');
const { productSchema, productUpdateSchema } = require('../schemas/product.schema');



function sanitizeProductBody( ) {
    return (req, res, next) => {
        const { postProduct } = req.body;
        const  parseProduct= JSON.parse(postProduct);
        const { error, value } = productSchema.validate(parseProduct, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
  }

  function sanitizeProductBodyUpdate( ) {
    return (req, res, next) => {

        console.log(req.body);
        const { editProduct } = req.body;
        const  parseProduct= JSON.parse(editProduct);
        const { error, value } = productUpdateSchema.validate(parseProduct, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
  }
  
module.exports = { sanitizeProductBody, sanitizeProductBodyUpdate };
