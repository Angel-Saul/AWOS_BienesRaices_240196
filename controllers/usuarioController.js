import Usuario from '../models/usuario.js';
import { check, validationResult } from 'express-validator';
import { generarToken, generarJWT } from '../lib/token.js';
// CORRECCIÓN: Se añade emailBloqueo a las importaciones
import { emailRegistro, emailResetearPassword, emailBloqueo } from '../lib/emails.js';
import jwt from 'jsonwebtoken';

// --- VISTAS ---
const formularioLogin = (req, res) => {
    res.render('auth/login', { pagina: "Ingresa los datos de la cuenta" });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', { pagina: "Registrate con nosotros" });
}

const formularioRegistro2 = (req, res) => {
    res.render('auth/registro2', { pagina: "Bienvenido" });
}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', { pagina: "Te enviaremos un email con la liga de restauración de contraseña" });
}

// --- LÓGICA DE AUTENTICACIÓN ---
const autenticarUsuario = async(req, res) => {
    const { emailUsuario: email, passwordUsuario: password } = req.body;
    
    await check('passwordUsuario').notEmpty().withMessage('La contraseña parece estar vacia').run(req);
    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty()) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar",
            errores: resultadoValidacion.array(),
            usuario: { emailUsuario: email }
        });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if(!usuario) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar",
            errores: [{"msg": `El usuario no existe`}],
            usuario: { emailUsuario: email }
        });
    }

    // 1. Verificar si la cuenta está bloqueada
    if (usuario.bloqueado) {
        return res.render("auth/login", {
            pagina: "Cuenta Bloqueada",
            errores: [{ msg: "Tu cuenta ha sido bloqueada por seguridad tras 5 intentos fallidos. Revisa tu email para desbloquearla." }],
            usuario: { emailUsuario: email }
        });
    }

    // 2. Validar confirmación de correo
    if(!usuario.confirmado) { 
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar",
            errores: [{"msg": `Tu cuenta no ha sido confirmada`}],
            usuario: { emailUsuario: email }
        });
    }

    // 3. Validar contraseña e intentos
    if(!usuario.validarPassword(password)) {
        // Incrementar contador de intentos
        usuario.intentos += 1;

        if (usuario.intentos >= 5) {
            usuario.bloqueado = true;
            usuario.token = generarToken(); 
            await usuario.save();

            // LLAMADA A LA FUNCIÓN DE EMAIL (Ya no dará error de ReferenceError)
            await emailBloqueo({ 
                nombre: usuario.nombre, 
                email: usuario.email, 
                token: usuario.token 
            });

            return res.render("auth/login", {
                pagina: "Cuenta Bloqueada",
                errores: [{ msg: "Has superado el límite de intentos. La cuenta se ha bloqueado por seguridad." }],
                usuario: { emailUsuario: email } 
            });
        }

        await usuario.save();

        return res.render("auth/login", {
            pagina: "Error al intentar ingresar",
            errores: [{"msg": `Contraseña incorrecta. Intento ${usuario.intentos} de 5.`}],
            usuario: { emailUsuario: email } 
        });
    }

    // 4. LOGIN EXITOSO
    usuario.intentos = 0;
    usuario.ultimoAcceso = new Date();
    await usuario.save();

    // const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
    const token = generarJWT(usuario.id);
    console.log(token);


    
    return res.cookie('_token', token, {
        httpOnly: true,
        sameSite: true
    }).redirect('/auth/mis-propiedades');
}

// --- LÓGICA DE DESBLOQUEO ---
const desbloquearCuenta = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } });

    if(!usuario) {
        return res.render("template/mensaje", {
            pagina: "Error de Verificación",
            mensaje: "El token de desbloqueo no es válido o ya fue utilizado.",
            error: true
        });
    }

    // Reactivar cuenta y limpiar rastro de bloqueo
    usuario.token = null;
    usuario.bloqueado = false;
    usuario.intentos = 0;
    await usuario.save();

    res.render("template/mensaje", {
        pagina: "Cuenta Reactivada",
        mensaje: "Tu cuenta ha sido desbloqueada con éxito. Ya puedes iniciar sesión.",
        buttonVisibility: true,
        buttonText: "Ir al Login",
        buttonURL: "/auth/login"
    });
}

// --- REGISTRO Y CONFIRMACIÓN ---
const registrarUsuario = async (req, res) => {
    const { nombreUsuario: nombre, emailUsuario: email, passwordUsuario: password } = req.body;

    await check('nombreUsuario').notEmpty().withMessage("El nombre no puede ser vacio").run(req);
    await check('emailUsuario').isEmail().withMessage("Formato de correo inadecuado").run(req);
    await check('passwordUsuario').isLength({ min: 8 }).withMessage("Mínimo 8 caracteres").run(req);
    await check("confirmUsuario").equals(password).withMessage("Las contraseñas no coinciden").run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render('auth/registro', {
            pagina: "Error al crear cuenta",
            errores: resultadoValidacion.array(),
            usuario: { nombreUsuario: nombre, emailUsuario: email }
        });
    }

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
        return res.render("auth/registro", {
            pagina: "Registrate",
            errores: [{ msg: `El correo ${email} ya está registrado` }],
            usuario: { nombreUsuario: nombre }
        });
    }

    const usuario = await Usuario.create({ nombre, email, password, token: generarToken() });
    emailRegistro({ nombre: usuario.nombre, email: usuario.email, token: usuario.token });

    res.render("template/mensaje", {
        pagina: "Cuenta creada",
        mensaje: "Hemos enviado un correo de confirmación."
    });
}

const paginaConfirmacion = async (req,res) => {
    const {token} = req.params;
    const usuarioToken = await Usuario.findOne({where:{token}});

    if(!usuarioToken) {
        return res.render("template/mensaje",{
            pagina: "Error al confirmar",
            mensaje: "Código de verificación no válido."
        });
    }

    usuarioToken.token = null;
    usuarioToken.confirmado = true;
    await usuarioToken.save();

    res.render("template/mensaje",{
        pagina: "Confirmación exitosa",
        mensaje: "Ya puedes ingresar a la plataforma",
        buttonVisibility: true,
        buttonText: "Ir al Login",
        buttonURL: "/auth/login"
    });
}

// --- RECUPERACIÓN DE PASSWORD ---
const resetearPassword = async (req, res) => {
    const { emailUsuario: email } = req.body;
    await check('emailUsuario').isEmail().withMessage("Correo inválido").run(req);

    let resultadoValidacion = validationResult(req);
    if(!resultadoValidacion.isEmpty()) {
        return res.render("auth/recuperar", {
            pagina: "Error", 
            errores: resultadoValidacion.array()
        });
    }

    const usuario = await Usuario.findOne({where: { email }});
    if(!usuario) {
        return res.render("template/mensaje", {
            pagina: "No encontrado",
            mensaje: "No existe cuenta con ese correo."
        });
    }

    usuario.token = generarToken();
    await usuario.save();

    emailResetearPassword({ nombre: usuario.nombre, email: usuario.email, token: usuario.token });

    res.render("template/mensaje", {
        pagina: "Correo enviado",
        mensaje: "Revisa tu bandeja de entrada."
    });
}

const formularioActualizacionPassword = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token } }); 

    if (!usuario) {
        return res.render("template/mensaje", {
            pagina: "Token no válido",
            mensaje: "El enlace para restablecer tu contraseña es inválido o ha expirado.",
            error: true
        });
    }

    // PASAR EL TOKEN A LA VISTA
    res.render("auth/resetearPassword", { 
        pagina: "Nueva Contraseña",
        csrfToken: req.csrfToken(),
        token // <--- ¡AÑADE ESTO!
    });
}

const actualizarPassword = async (req, res) => {
    const { passwordUsuario } = req.body;
    const { token } = req.params;

    // 1. Validaciones de Express Validator
    await check('passwordUsuario').isLength({ min: 8 }).withMessage('El password debe ser de al menos 8 caracteres').run(req);
    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Restablecer Contraseña",
            errores: resultadoValidacion.array(),
            csrfToken: req.csrfToken(),
            token // IMPORTANTE: Reenviar el token para que el form no pierda el action
        });
    }

    // 2. Buscar al usuario
    const usuario = await Usuario.findOne({ where: { token } });

    // 3. VALIDACIÓN CRÍTICA: Si el token es inválido o el usuario no existe
    if (!usuario) {
        return res.render("template/mensaje", {
            pagina: "Error al actualizar",
            mensaje: "Hubo un error al validar tu información, el token no es válido o ya expiró",
            error: true
        });
    }

    // 4. Si todo está bien, actualizar
    usuario.password = passwordUsuario;
    usuario.token = null;
    usuario.intentos = 0; 
    usuario.bloqueado = false; 
    await usuario.save();

    res.render("template/mensaje", {
        pagina: "Contraseña actualizada",
        mensaje: "Ya puedes loguearte con tu nueva clave.",
        buttonVisibility: true,
        buttonText: "Ir al Login",
        buttonURL: "/auth/login"
    });
}
// --- ADMINISTRACIÓN ---
const admin = async (req, res) => {
    const { _token } = req.cookies;
    if (!_token) return res.redirect('/auth/login');

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id, { attributes: ['nombre', 'id'] });

        if(!usuario) return res.redirect('/auth/login');

        // res.render('propiedades/admin', {
        //prueba redirección, clase
        res.render('main/mis-propiedades', {
            pagina: 'Mis Propiedades',
            usuario: usuario,
            buttonVisibility: true,
            buttonText: "Publicar Propiedad",
            buttonURL: "/auth/propiedades/crear"
        });
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

export {
    admin,
    formularioLogin,
    autenticarUsuario,
    formularioRegistro,
    formularioRegistro2,
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword, 
    actualizarPassword, 
    cerrarSesion,
    desbloquearCuenta
}