
const { signUpSchema, userUpdateSchema } = require('../schemas/auth.schemas') 

function sanitizeSignUp() {
    return (req, res, next) => {
        const { error, value } = signUpSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ msg: error.message });
      }
      req.body = value;
      next();
    };
}

function sanitizeUserUpdate() {
  return (req, res, next) => {
      const { error, value } = userUpdateSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ msg: error.message });
    }
    req.body = value;
    next();
  };
}

module.exports = { sanitizeSignUp, sanitizeUserUpdate };
