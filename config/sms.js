
const twilio = require ('twilio');

//estabezco mi conexion con twilio
client = new twilio (process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//en esta funcion disparo el sms
const createSMS = (phone , code)=>{

  // Expresión regular que valida números de celulares en Argentina
  const phoneRegex = /^(\+54|54)?\s*([1-9]\d{0,3})?\s*([1-9]\d{5,7})$/;
  
    const tempPhone = "+54" + phone;

    if (!phoneRegex.test(phone)) {
        throw new Error('El número de teléfono ingresado no es válido');
      }
    console.log('tempPhone',tempPhone);

    client.messages.create({
        body: 'aca iria el codigo: '+ code,
        to: tempPhone , //mientras sea cuenta de prueba solo me permite el numero verificado
        from: process.env.NUMBER_PHONE
    }).then((message) => console.log(message.sid))
    .catch((error) => console.log('Error al enviar el mensaje desde sms.js', error));
}

module.exports = createSMS;