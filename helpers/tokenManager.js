


const jwt = require ('jsonwebtoken');


const generateToken = ( _id ) =>{ 

        const payload =  {_id } ; 
        
        const expiresIn = 60 * 5;
        console.log("desde generateToken: ",payload);

        try {

            const token = jwt.sign(payload , process.env.SECRETORPRIVATEKEY,{ expiresIn })
            return { token, expiresIn };
        } catch (error) {
            console.log("desde generate Token",error);
        }
    }


const generateRefreshToken = ( _id, res ) => {

    // le estoy diciendo q dure un Mes
    const expiresIn = 60 * 60 * 24  * 30;

    const payload = { _id };

    console.log("desde generateRefreshToken: ",payload);

try {
    const refreshToken = jwt.sign( payload , process.env.REFRESHPRIVATEKEY,{ expiresIn })

//    console.log('refreshToken', refreshToken);
    // la cookie tiene un tiempo de expiracion distina le digo q dure el mes a partir de hoy y se multiplica por mil
    // xq el date() esta en milisegundos
    res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000),
        })
    
} catch (error) {

    console.log("ERROR generateRefreshToken",error);
}
        


}

const tokenVerificationErrors = {
    "invalid signature": "La firma del JWT no es válida",
    "jwt expired": "JWT expirado",
    "invalid token": "Token no válido",
    "No Bearer": "Utiliza formato Bearer",
    "jwt malformed": "JWT formato no válido",
};



module.exports= {
              tokenVerificationErrors,
              generateToken,
              generateRefreshToken

            }