
const checkField = require('./check-fields');
// const checkJwt = require('./check-jwt');
const checkRole = require('./check-role');
const checkElId = require('./checkElId')
// const checkFileUp = require('./chech-file');


module.exports={
    ...checkField,
    // ...checkJwt,
    ...checkRole,
    ...checkElId
    // ...checkFileUp
}

