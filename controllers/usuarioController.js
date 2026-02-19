const formularioLogin = (req, res) => {
    res.render('auth/login', {pagina: "Ingresa los datos de la cuenta"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', {pagina: "Te enviaremos un email con la liga de restauración de contraseña"});
}

export {
    formularioLogin, formularioRegistro, formualrioRecuperar
}