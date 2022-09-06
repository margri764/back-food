
const twilio = require ('twilio');


//estabezco mi conexion con twilio
const client = new twilio (process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//en esta funcion disparo el sms
const createSMS= (phone , code)=>{

    client.messages.create({
        body: 'aca iria el codigo: '+ code,
        to: phone , //mientras sea cuenta de prueba solo me permite el numero verificado
        from: process.env.NUMBER_PHONE
    }).then((message) => console.log(message.sid))
}

module.exports= createSMS;