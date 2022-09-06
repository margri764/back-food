const nodemailer = require('nodemailer');

const mail = {
    user: 'development@feintdevs.com',
    pass: 'bulFeintdevs#1820'
}

let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    greetingTimeout : 1000 * (60), // try adding greetingTimeout property 
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
    secure: true, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
  });

  const sendEmail = async (email, subject, html) => {
    try {

   

        await transporter.sendMail({
            from: `Food-App <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Este es un email para confirmar identidad.", // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  const getTemplate = ( token) => {


      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        <div id="email___content">

            <img src="../assets/back.png" alt="">

        
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a href="http://localhost:4200/confirmar/emailkey/${token}" target="_blank" > Confirmar Cuenta</a>
        </div>
      `;
  }

  module.exports = {
    sendEmail,
    getTemplate
  }

  // <a href="https://backclap.herokuapp.com/bienvenida/${ token }" target="_blank" > Confirmar Cuenta</a>
