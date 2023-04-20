
const {productSchema, productUpdateSchema, operationSchema } = require('../schemas/product.schema') 



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

function sanitizeOperation( ) {
    return (req, res, next) => {
      const { error, value } = operationSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      console.log(req.body);
      next();
    };
}


module.exports = { sanitizeProductBody, sanitizeProductBodyUpdate, sanitizeOperation };
