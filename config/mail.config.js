
const nodemailer = require('nodemailer');


const mail = {
    user: process.env.USER_REVIMACK,
    pass: process.env.PASSWORD_REVIMACK
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

  const sendEmail = async (email, resetToken) => {

    const resetUrl= `http://localhost:4200/confirm/new-password/${resetToken}`
    const html = 
     `
            <p>Se ha solicitado un restablecimiento de contraseña para su cuenta.</p>
            <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
            <a href="${resetUrl}"> <b>Presioná aqui para restablecer contraseña</b> </a>
            <p>Si no ha solicitado un restablecimiento de contraseña, ignore este correo electrónico.</p>
      `

    try {
        
        await transporter.sendMail({
            from: `app_name <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject: "Este es un email de recuperacion de password.", // Subject line
            text: "Este es un email de recuperacion de password.", // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }


  module.exports = {
                    sendEmail,
                   }