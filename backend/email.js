import nodemailer from 'nodemailer';

// Configura el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usa el servicio de Gmail (puedes cambiarlo por otro)
  auth: {
    user: 'yusmarseocontenido@gmail.com', // Tu dirección de correo
    pass: 'xzss oagn abir eozg', // Tu contraseña de correo o token de app
  },
});

export const enviarCorreo = async (destinatario, codigo) => {
  const mailOptions = {
    from: 'yusmarseocontenido@gmail.com',
    to: destinatario,
    subject: 'Código de Verificación',
    text: `Tu código de verificación es: ${codigo}`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    //console.log('Correo enviado', result);
    return true;
  } catch (error) {
    console.error('Error al enviar correo', error);
    return false;
  }
};
