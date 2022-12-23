
const checkField = require('./check-fields');
const checkJwt = require('./check-jwt');
const checkRole = require('./check-role');


module.exports={
    ...checkField,
    ...checkJwt,
    ...checkRole,
    // ...checkFileUp
}

