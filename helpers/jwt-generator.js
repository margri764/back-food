
const jwt = require ('jsonwebtoken');

const JWTGenerator = ( _id ) =>{ 

    return new Promise( (resolve, reject) =>{

        const payload = { _id }; 

        jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{ 

            // expiresIn:'500h' 

        }, (err , token)=>{ 
            if(err){
                console.log(err);
                reject( 'no se pudo generar el JWT')
            }else{
                resolve ( token );
         }
        })

    })


}

module.exports= { JWTGenerator };