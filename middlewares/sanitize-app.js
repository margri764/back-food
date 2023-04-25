const { hourlySchema } = require('../schemas/app.schema')

function sanitizeHourlyApp( ) {
    return (req, res, next) => {
      const { error, value } = hourlySchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
}

module.exports = { sanitizeHourlyApp };
