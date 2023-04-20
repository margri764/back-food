const { purchaseOrderSchema } = require('../schemas/purchaseOrder.schema') 

function sanitizePurchaseOrder() {
    return (req, res, next) => {
      console.log(req.body);
        const { error, value } = purchaseOrderSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
}

module.exports = { sanitizePurchaseOrder };
