const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autentificado: false,
        nombre: '',
        titulo: 'Iniciar Sesión'
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        
    });
}

export {
    formularioLogin, formularioRegistro
}