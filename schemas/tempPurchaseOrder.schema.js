const Joi = require('joi');
const mongoose = require('mongoose');

const tempPurchaseOrderSchema = Joi.object({
  productID: Joi.array().items(
    Joi.object({
      quantity: Joi.number().strict().required(),
      _id: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message('No es un ID mongo');
        }
        return value;
      }).required(),
    })
  ),

  drink: Joi.array().items(
    Joi.object({
        quantity: Joi.number().strict().required(),
        _id: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.message('No es un ID mongo');
            }
            return value;
          }).required(),
    })
  ),

  fries: Joi.array().items(
    Joi.object({
       quantity: Joi.number().strict().required(),
       _id: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message('No es un ID mongo');
        }
        return value;
      }).required(),
    })
  ),
  
  customMenu: Joi.array().items(Joi.string()),
  total: Joi.number().strict().required(),
});


module.exports = { tempPurchaseOrderSchema };
