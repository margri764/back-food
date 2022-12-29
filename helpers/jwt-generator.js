
const jwt = require ('jsonwebtoken');

const JWTGenerator = ( _id ) =>{ 



    // const getToken = (payload) => {
    //     return jwt.sign({
    //         data: payload
    //     }, 'SECRET', { expiresIn: '1h' });
    // }
    
    return new Promise( (resolve, reject) =>{

        const payload =  {_id } ; 
        
       

        jwt.sign(payload , process.env.SECRETORPRIVATEKEY,{ 

            expiresIn: "20s"

        }
        , (err , token)=>{ 
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