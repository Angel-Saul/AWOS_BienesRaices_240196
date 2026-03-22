import Usuario from '../models/usuario.js';
import { check, validationResult } from 'express-validator';
import { generarToken } from '../lib/token.js';
import { emailRegistro, emailResetearPassword } from '../lib/emails.js';

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

const formularioActualizacionPassword = async (req, res) => { // Agregado async
    console.log(req.body); // Corregido .log
    const { token } = req.params;
    
    console.log(`El usuario con token: ${token} está intentando actualizar su contraseña`);
    
    // Usamos Usuario (el modelo importado) y await
    const usuarioSolicitante = await Usuario.findOne({ where: { token } }); 

    if (!usuarioSolicitante) {
        return res.render("template/mensaje", {
            pagina: "Token no válido",
            mensaje: "Hubo un error al validar tu información, intenta de nuevo",
            error: true
        });
    }

    res.render("auth/resetearPassword", {
        pagina: "Ingresa tu nueva contraseña",
        csrfToken: req.csrfToken ? req.csrfToken() : null // Si usas CSRF
    });
};

 const registrarUsuario = async (req, res) => {
    console.log("Intentando registrar un nuevo usuario:");

    const { nombreUsuario: nombre, emailUsuario: email, passwordUsuario: password } = req.body;

    // Validación de los datos del formulario previo a registro en la BD 
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacio").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electronico no puede ser vacio").isEmail().withMessage("El correo no tiene formato adecuado").run(req);
    await check('passwordUsuario').notEmpty().withMessage("La contraseña no puede ser vacia").isLength({ min: 8, max: 30 }).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caracteres").run(req);
    await check("confirmUsuario").equals(password).withMessage("Ambas contraseñas deben de ser iguales").run(req);

    // aplicamos las reglas definidas
    let resultadoValidacion = validationResult(req);

    //Verificar si el usuario no está previamente registrado en la bd 
    const existeUsuario = await Usuario.findOne({ where: { email } })


    if (existeUsuario) {
        res.render("auth/registro", {
            pagina: "Registrate con nosotros :)",
            errores: [{ msg: `Ya existe el usuario asociado al correo: ${email}` }],
            usuario: {
                nombreUsuario: nombre,
            }
        });
    }



    if (resultadoValidacion.isEmpty()) {
        const data = {
            nombre,
            email,
            password,
            token: generarToken()
        }
        const usuario = await Usuario.create(data);

        //Enviar correo electronico 
        emailRegistro ({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })


        res.render("template/mensaje", {
            pagina: "Bienvenid@ a BienesRaices!",
            mensaje: `La cuenta asociada al correo ${email}, se ha creado satisfactoriamente, 
            te pedimos confirmar tu cuenta a través del correo electronico que te hemos mandado`
        });
    } else {
        res.render('auth/registro', {
            pagina: "Error al intentar crear una cuenta",
            errores: resultadoValidacion.array(),
            usuario: {
                nombreUsuario: nombre,
                emailUsuario: email
            },
        });
    }
}


const paginaConfirmacion = async (req,res) =>
{
    const {token: tokenCuenta} = req.params
    console.log("Confirmando la cuenta asociada al token: ", tokenCuenta)

    //Confirmar soi el token existe
    const usuarioToken = await(Usuario.findOne({where:{token:tokenCuenta}}))
    console.log(usuarioToken);

    if(!usuarioToken)
    {
        res.render("template/mensaje",{
            pagina: "Error al comfirmar la cuenta",
            mensaje: `El codigo de verificacion (no es valido), por favor intentalo de nuevo.`
        });
    }

    //Actualizar los datos del usuario.
    usuarioToken.token=null;
    usuarioToken.confirmado=true;
    usuarioToken.save();

    res.render("template/mensaje",{
            pagina: "Confirmacion exitosa",
            mensaje: `La cuenta de: ${usuarioToken.nombre}, asociada al correo electronico: ${usuarioToken.email}
                se ha confirmado, ahora ya puedes ingresar a la plataforma`,
            buttonVisibility: true,
            buttonText: "Ingresa a BienesRaices-240196",
            buttonURL: "/auth/login"
        });

}



const resetearPassword = async (req, res) => {
    const  { emailUsuario : usuarioSolicitante } = req.body
    console.log(`El usuario con correo ${usuarioSolicitante} está solicitando un reseteo de contraseña.`)

// Validaciones del Frontend 
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)

    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty())
    {
        return res.render("auth/recuperar", { // Te sugiero agregar 'return' para detener la ejecución
            pagina: "Error, correo inválido", 
            errores: resultadoValidacion.array(), 
            usuario: { emailUsuario: usuarioSolicitante } // <--- Corregido
        });
    }



    //Validación 1
    const usuario = await Usuario.findOne({where: { email: usuarioSolicitante }});
    //SELECT email FROM tb_usuarios WHERE email = usuarioSolicitante //SQL Injection
    if(!usuario) {
            res.render("template/mensaje", {
                pagina: "Error al buscar la cuenta",
                mensaje: `No se ha encontrado ninguna cuenta asociada al correo: ${usuarioSolicitante}`,
                buttonVisibility: true,
                buttonText: "Ingresa a BienesRaices-240196",
                buttonURL: "/auth/recuperar"
            });
    }

    else {
        //Validación 2
        if (!usuario.confirmado) {
           return res.render("template/mensaje", {
                pagina: "Error, la cuenta no está confirmada",
                mensaje: `La cuenta asociada al correo: ${usuarioSolicitante} no ha sido validad a través de la liga segura envviada al correo electronico.`,
                buttonVisibility: true,
                buttonText: "Intentalo de nuevo",
                buttonURL: "/auth/recuperar"
            }); 
        }
        else {
            //Actualizar token
            usuario.token = generarToken();
            usuario.save();

            //Enviar por correo el token 
            emailResetearPassword({
                nombre: usuario.nombre,
                email: usuario.email,
                token: usuario.token
            })
        }

        //Renderizar con una vista de correo enviada
        res.render("template/mensaje",{
            pagina: "Correo para la Restauración de la Contraseña",
            mensaje: `Un paso más, te hemos enviado un correo electronico con la liga segura para la restauración de tu contraseña`,
            buttonVisibility: false
        });

    }
}

const actualizarPassword = async (req, res) => {
    const { passwordUsuario } = req.body; // Asegúrate que el name en el input sea este
    const { token } = req.params; // Normalmente necesitas el token para saber a quién cambiarle la clave

    // Validación
    await check('passwordUsuario').notEmpty().withMessage("La contraseña no puede estar vacía").isLength({ min: 8 }).withMessage("Mínimo 8 caracteres").run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Restablecer Contraseña",
            errores: resultadoValidacion.array()
        });
    }

    // Lógica para guardar el nuevo password...
    const usuario = await Usuario.findOne({ where: { token } });
    // usuario.password = passwordUsuario; ... etc
}

// IMPORTANTE: Exportar la nueva función formularioRegistro2
export {
    formularioLogin,
    formularioRegistro,
    formularioRegistro2, 
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword, 
    actualizarPassword
}