import nodemailer from 'nodemailer';

const emailRegistro =  async(datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

const {email, nombre, token}= datos //Destructiración de los datos 

await transport.sendMail({
    from: 'BienesRaices-240196.com',
    to: email,
    subject: 'Bienvenid@ a la Pltaforma de Bienes Raíces - Confirma tu cuenta',
    html: `
        <p>Hola! ${nombre}, comprueba tu cuenta de bienesraices_240196.com</p>
        <hr>
        <a>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
        <a href="localhost:${process.env.PORT}/auth/confirma/${token}">Confirmar Cuenta</a></p>
        <p>En caso de que no seas tú, quien creó la cuenta ignora este correo electronico
        </p>`
});
}

export {emailRegistro}