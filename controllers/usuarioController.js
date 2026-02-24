import  Usuario from '../models/usuario.js';


const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Ingresa los datos de la cuenta"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', {pagina: "Te enviaremos un email con la liga de restauración de contraseña"});
}


const registrarUsuario = async (req, res) => {

    console.log("Intentando registrar un nuevo usuario:");
    console.log(req.body);

    const data = {
        nombre: req.body.nombreUsuario,
        email: req.body.emailUsuario,
        password: req.body.passwordUsuario
    };

    const usuario = await Usuario.create(data);

    res.json(usuario);
}
export {
    formularioLogin, formularioRegistro, formualrioRecuperar, registrarUsuario
}