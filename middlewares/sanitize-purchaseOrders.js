const { purchaseOrderSchema } = require('../schemas/purchaseOrder.schema') 

function sanitizePurchaseOrder() {
    return (req, res, next) => {
      const { order } = req.body;
      console.log(order);
        const { error, value } = purchaseOrderSchema.validate(order, { stripUnknown: true });
      if (error) {
        console.log('error desde el sanitizador de purchaseSchema: ', error);
        return res.status(400).json({ message: error.message });
      }
      req.body.order = value;
      next();
    };
}

module.exports = { sanitizePurchaseOrder };
