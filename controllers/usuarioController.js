import Usuario from '../models/usuario.js';
import { check, validationResult } from 'express-validator';

const formularioLogin = (req, res) => {
    res.render('auth/login', { pagina: "Ingresa los datos de la cuenta" });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', { pagina: "Registrate con nosotros" });
}

// --- NUEVA FUNCIÓN PARA EL LOGIN DE REDES SOCIALES ---
const formularioRegistro2 = (req, res) => {
    res.render('auth/registro2', { pagina: "Bienvenido" });
}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', { pagina: "Te enviaremos un email con la liga de restauración de contraseña" });
}

const registrarUsuario = async (req, res) => {
    console.log("Intentando registrar un nuevo usuario:");
    
    const {name, email, password } = req.body;

    // Validación de los datos del formulario previo a registro en la BD 
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacio").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electronico no puede ser vacio").isEmail().withMessage("El correo no tiene formato adecuado").run(req);
    await check('passwordUsuario').notEmpty().withMessage("La contraseña no puede ser vacia").isLength({ min: 8, max: 30 }).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caracteres").run(req);
    await check("confirmUsuario").equals(req.body.passwordUsuario).withMessage("Ambas contraseñas deben de ser iguales").run(req);

    // aplicamos las reglas definidas
    let resultadoValidacion = validationResult(req); 

    if (resultadoValidacion.isEmpty()) {
        const data = {
            nombre: req.body.nombreUsuario,
            email: req.body.emailUsuario,
            password: req.body.passwordUsuario
        }
        const usuario = await Usuario.create(data);
        res.json(usuario);
    } else {
        res.render('auth/registro', {
            pagina: "Error al intentar crear una cuenta", 
            errores: resultadoValidacion.array(),
            usuario: {
                nombreUsuario: req.body.nombreUsuario,
                emailUsuario: req.body.emailUsuario
            }
        });
    }
}

// IMPORTANTE: Exportar la nueva función formularioRegistro2
export {
    formularioLogin, 
    formularioRegistro, 
    formularioRegistro2, // <--- Esta es la clave
    formualrioRecuperar, 
    registrarUsuario
}