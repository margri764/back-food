
const checkField = require('./check-fields');
const checkJwt = require('./check-jwt');
const checkRole = require('./check-role');
const requireToken = require ('./requireToken')
const requireRefreshToken = require ('./requireRefreshToken')


module.exports={
    ...checkField,
    ...checkJwt,
    ...checkRole,
    ...requireToken,
    ...requireRefreshToken
}

