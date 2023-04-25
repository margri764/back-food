
const { staffSchema, staffUpdateSchema } = require('../schemas/staff.schema') 



function sanitizeStaff( ) {
    return (req, res, next) => {
      const { error, value } = staffSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      next();
    };
}

function sanitizeUpdateStaff( ) {
    return (req, res, next) => {
      const { error, value } = staffUpdateSchema.validate(req.body, { stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      req.body = value;
      console.log(req.body);

      next();
    };
}



module.exports = { sanitizeStaff, sanitizeUpdateStaff };
