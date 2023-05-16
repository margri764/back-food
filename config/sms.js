
const twilio = require ('twilio');

//estabezco mi conexion con twilio
client = new twilio (process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

 const createSMS = async (phone, code) => {
  // Expresión regular que valida números de celulares en Argentina
  const phoneRegex = /^(\+54|54)?\s*([1-9]\d{0,3})?\s*([1-9]\d{5,7})$/;
  const tempPhone = "+54" + phone;

  if (!phoneRegex.test(phone)) {
    throw new Error('El número de teléfono ingresado no es válido');
  }

  try {
    const message = await client.messages.create({
      body: 'aca iria el codigo: ' + code,
      to: tempPhone, //mientras sea cuenta de prueba solo me permite el numero verificado
      from: process.env.NUMBER_PHONE,
    });

 
  } catch (error) {
    throw new Error('Error al enviar el mensaje');
  }
};

module.exports = createSMS;
