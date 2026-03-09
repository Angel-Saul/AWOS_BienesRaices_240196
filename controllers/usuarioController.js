import Usuario from '../models/usuario.js';
import { check, validationResult } from 'express-validator';
import { generarToken } from '../lib/token.js';
import { emailRegistro } from '../lib/emails.js';

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
            }
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
                se ha confirmado, ahora ya puedes ingresar a la plataforma`
        });

}





// IMPORTANTE: Exportar la nueva función formularioRegistro2
export {
    formularioLogin,
    formularioRegistro,
    formularioRegistro2, 
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion
}