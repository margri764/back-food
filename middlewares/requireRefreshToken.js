

const jwt = require ("jsonwebtoken");
const { tokenVerificationErrors } = require("../helpers/tokenManager.js");

 const requireRefreshToken = (req, res, next) => {

    try {
        const refreshTokenCookie = req.cookies.refreshToken;

        if (!refreshTokenCookie) throw new Error("No existe el token");

        const { _id } = jwt.verify(refreshTokenCookie, process.env.REFRESHPRIVATEKEY);

        req._id = _id;
        
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: tokenVerificationErrors[error.message] });
    }
};

module.exports = { requireRefreshToken}
