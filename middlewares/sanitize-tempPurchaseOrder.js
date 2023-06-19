const { tempPurchaseOrderSchema } = require('../schemas/tempPurchaseOrder.schema') 

function sanitizeTempPurchaseOrder() {
    return (req, res, next) => {
        const { error, value } = tempPurchaseOrderSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ msg: error.message });
      }
      req.body = value;
      next();
    };
}

module.exports = { sanitizeTempPurchaseOrder };
