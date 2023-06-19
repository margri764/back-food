const jwt = require ('jsonwebtoken');

const generateToken =  ( _id ) =>{ 

        const payload =  {_id } ; 
        const expiresIn = 60 * 60 * 60;
        // const expiresIn = 10;

        try {
            const token = jwt.sign(payload , process.env.SECRETORPRIVATEKEY,{ expiresIn })

            return { token, expiresIn };
        } catch (error) {
            console.log("error desde generateToken", error);
            
        }
    }


const generateRefreshToken = async ( _id, res ) => {

    // le estoy diciendo q dure un Mes
    const expiresIn = 60 * 60 * 24  * 30;
    // const expiresIn = 40;

    const payload = { _id };

    console.log("desde generateRefreshToken: ",payload);

try {
    const refreshToken = jwt.sign( payload , process.env.REFRESHPRIVATEKEY, { expiresIn })

//    console.log('refreshToken', refreshToken);
    // la cookie tiene un tiempo de expiracion distina le digo q dure el mes a partir de hoy y se multiplica por mil
    // xq el date() esta en milisegundos
    await new Promise((resolve, reject) => {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000),
            // se llama al callback para resolver la promesa
            // una vez que se ha establecido la cookie
            callback: (err) => {
                if (err) reject(err);
                else resolve();
            }
        });
    });
    
} catch (error) {

    console.log("ERROR generateRefreshToken: ",error);
}
        

}




module.exports= {
              generateToken,
              generateRefreshToken

            }