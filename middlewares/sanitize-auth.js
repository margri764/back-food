
const { signUpSchema } = require('../schemas/auth.schemas') 

function sanitizeSignUp() {
    return (req, res, next) => {
        const { error, value } = signUpSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
}

module.exports = { sanitizeSignUp };
