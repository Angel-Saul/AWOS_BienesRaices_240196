import Usuario from '../models/usuario.js';
import { check, validationResult } from 'express-validator';
import { generarToken } from '../lib/token.js';
import { emailRegistro, emailResetearPassword } from '../lib/emails.js';

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

// --- LÓGICA DE AUTENTICACIÓN (LOGIN) ---

const autenticarUsuario = async(req,res) =>{
    const {emailUsuario: email, passwordUsuario: password} = req.body
    console.log(`Un usuario: ${email} con password: ${password} quiere loguearse al sistema`);

    // Validación de campos vacíos y longitud
    await check('passwordUsuario').notEmpty().withMessage('La contraseña parece estar vacia')
    .isLength({min:8, max:30}).withMessage('Longitud de la contraseña debe ser entre 8 y 30 caracteres').run(req);

    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty()) {
        return res.render("auth/login",{
            pagina: "Error al intentar ingresar",
            errores: resultadoValidacion.array(),
            usuario: {emailUsuario: email}
        });
    }

    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findOne({where:{email}});

    if(!usuario) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{"msg": `No existe un usuario asociado a : ${email}`}]
        });
    }

    // Validar si la cuenta está confirmada
    if(!usuario.confirmado) { // Cambié confirmed por confirmado para que coincida con tu modelo
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{"msg": `La cuenta asociada a : ${email} no está confirmada`}]
        });
    }

    // Validar contraseña
    console.log("Validando Contraseñas");
    if(!usuario.validarPassword(password)) {
        return res.render("auth/login", {
            pagina: "Error al intentar ingresar a la plataforma",
            errores: [{"msg": `Contraseña incorrecta, por favor inténtalo de nuevo`}]
        });
    }

    // Si todo es correcto, redirigir (Ejemplo al home)
    res.redirect('/');
}

// --- LÓGICA DE REGISTRO Y RECUPERACIÓN ---

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
            mensaje: "Intenta de nuevo",
            error: true
        });
    }

    res.render("auth/resetearPassword", { pagina: "Nueva Contraseña" });
}

const actualizarPassword = async (req, res) => {
    const { passwordUsuario } = req.body;
    const { token } = req.params;

    await check('passwordUsuario').isLength({ min: 8 }).run(req);
    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Error",
            errores: resultadoValidacion.array()
        });
    }

    const usuario = await Usuario.findOne({ where: { token } });
    usuario.password = passwordUsuario;
    usuario.token = null;
    await usuario.save();

    res.render("template/mensaje", {
        pagina: "Contraseña actualizada",
        mensaje: "Ya puedes loguearte con tu nueva clave."
    });
}

export {
    formularioLogin,
    autenticarUsuario, // AGREGADO
    formularioRegistro,
    formularioRegistro2,
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword, 
    actualizarPassword
}