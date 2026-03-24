import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    // Definimos la URL base con un respaldo por si el .env falla
    const urlBase = process.env.BACKEND_URL || 'http://localhost';
    const puerto = process.env.PORT || 40196;

    await transport.sendMail({
        from: 'BienesRaíces <no-reply@bienesraices.com>',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaíces',
        html: `
            <div style="font-family: sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-left: 8px solid #a3e635;">
                    
                    <div style="padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                        <h1 style="font-size: 28px; font-weight: 800; color: #a3e635; margin: 0; letter-spacing: -1px;">
                            Bienes<span style="color: #000000; font-weight: 400;">Raíces</span>
                        </h1>
                    </div>

                    <div style="padding: 40px 30px; color: #334155; line-height: 1.8;">
                        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">¡Hola, ${nombre}!</h2>
                        <p style="margin-bottom: 25px;">Gracias por unirte a nuestra plataforma. Tu cuenta en <b>BienesRaíces</b> ya está casi lista, solo necesitas confirmarla para comenzar.</p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${urlBase}:${puerto}/auth/confirma/${token}" 
                               style="display: inline-block; padding: 16px 35px; background-color: #a3e635; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
                               Confirmar Cuenta
                            </a>
                        </div>

                        <p style="margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si no reconoces esta solicitud o no creaste una cuenta con nosotros, puedes ignorar este correo de forma segura.
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #cbd5e1;">
                        &copy; 2026 BienesRaíces. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        `
    });
};

const emailResetearPassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    // Respaldo de URL
    const urlBase = process.env.BACKEND_URL || 'http://localhost';
    const puerto = process.env.PORT || 40196;

    await transport.sendMail({
        from: 'BienesRaíces <no-reply@bienesraices.com>',
        to: email,
        subject: 'Restablece tu contraseña - BienesRaíces',
        html: `
            <div style="font-family: sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-left: 8px solid #a3e635;">
                    
                    <div style="padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                        <h1 style="font-size: 28px; font-weight: 800; color: #a3e635; margin: 0; letter-spacing: -1px;">
                            Bienes<span style="color: #000000; font-weight: 400;">Raíces</span>
                        </h1>
                    </div>

                    <div style="padding: 40px 30px; color: #334155; line-height: 1.8;">
                        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Hola, ${nombre}</h2>
                        <p style="margin-bottom: 25px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. No te preocupes, puedes generar una nueva haciendo clic abajo:</p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${urlBase}:${puerto}/auth/actualizarPassword/${token}" 
                               style="display: inline-block; padding: 16px 35px; background-color: #a3e635; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
                               Restablecer Contraseña
                            </a>
                        </div>

                        <p style="margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual permanecerá segura y sin cambios.
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #cbd5e1;">
                        &copy; 2026 BienesRaíces. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        `
    });
};

const emailBloqueo = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    // Respaldo de URL por seguridad
    const urlBase = process.env.BACKEND_URL || 'http://localhost';
    const puerto = process.env.PORT || 40196;

    await transport.sendMail({
        from: 'BienesRaíces <seguridad@bienesraices.com>',
        to: email,
        subject: 'Seguridad: Tu cuenta ha sido bloqueada',
        html: `
            <div style="font-family: sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-left: 8px solid #ef4444;">
                    
                    <div style="padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                        <h1 style="font-size: 28px; font-weight: 800; color: #ef4444; margin: 0; letter-spacing: -1px;">
                            Alerta de <span style="color: #000000; font-weight: 400;">Seguridad</span>
                        </h1>
                    </div>

                    <div style="padding: 40px 30px; color: #334155; line-height: 1.8;">
                        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Hola, ${nombre}</h2>
                        <p style="margin-bottom: 25px;">Hemos detectado <b>5 intentos fallidos</b> de inicio de sesión en tu cuenta. Por tu protección, hemos bloqueado el acceso temporalmente.</p>
                        
                        <p>Si fuiste tú y olvidaste tu contraseña, o si quieres reactivar tu cuenta ahora mismo, haz clic en el siguiente botón:</p>

                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${urlBase}:${puerto}/auth/desbloquear/${token}" 
                               style="display: inline-block; padding: 16px 35px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">
                               Desbloquear Mi Cuenta
                            </a>
                        </div>

                        <p style="margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            Si no intentaste entrar a tu cuenta, te recomendamos cambiar tu contraseña inmediatamente una vez que la hayas desbloqueado.
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #cbd5e1;">
                        &copy; 2026 BienesRaíces. Protección de Cuenta Activa.
                    </div>
                </div>
            </div>
        `
    });
};

// No olvides exportarla junto a las demás
export { emailRegistro, emailResetearPassword, emailBloqueo };