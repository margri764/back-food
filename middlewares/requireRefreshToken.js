

const jwt = require ("jsonwebtoken");

 const requireRefreshToken = (req, res, next) => {

    try {
        const refreshTokenCookie = req.cookies.refreshToken;


        if (!refreshTokenCookie) throw new Error("No existe el token");

        const { _id } = jwt.verify(refreshTokenCookie, process.env.REFRESHPRIVATEKEY);

        req._id = _id;
        
        next();
        
    } catch (error) {
        console.log("error desde requireRefreshToken: ", error);
        return res.status(401).json({ 
            success: false,
            msg : "Sin token",
        });
    }
};

module.exports = { requireRefreshToken}
