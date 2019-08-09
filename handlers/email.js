// Importar nodemailer
const nodemailer = require('nodemailer');
// Importar pug
const pug = require('pug');
// Importar juice
const juice = require('juice');
// Importar html-to-text
const htmlToText = require('html-to-text');
// Importar la configuración de Mailtrap.io
const mailTrapConfig = require('../config/email');

//Realizar el envío del correo electrónico
// https://nodemailer.com/about/
exports.enviarCorreo = async (opciones) => {
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: mailTrapConfig.host,
        port: mailTrapConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailTrapConfig.user, // generated ethereal user
            pass: mailTrapConfig.pass // generated ethereal password
      }
    });

     // Generar HTML desde una vista en PUG
     const generarHTML = (vista, opciones = {}) => {
        const html = pug.renderFile(`${__dirname}/../views/emails/${vista}.pug`, opciones);
        return juice(html);
    }

    const html = generarHTML(opciones.vista, opciones);
    // const text = htmlToText(html);
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"foodland <no-reply@foodland.com>', // sender address
        to: opciones.usuario.correo, // list of receivers
        subject: opciones.subject, // Subject line
        text: 'hola', // plain text body
        html // html body
    });
}