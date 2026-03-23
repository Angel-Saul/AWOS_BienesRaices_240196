import express from "express";
import passport from 'passport'; 
import { 
    formularioLogin, 
    autenticarUsuario, 
    registrarUsuario, 
    formularioRegistro, 
    formularioRegistro2, 
    formualrioRecuperar, 
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword,
    actualizarPassword,
    admin, 
    cerrarSesion,
    desbloquearCuenta // <--- 1. IMPORTAMOS LA FUNCIÓN DE DESBLOQUEO
} from '../controllers/usuarioController.js';

const router = express.Router();

// ==========================================
//    RUTAS DE ADMINISTRACIÓN (PRIVADAS)
// ==========================================

router.get("/mis-propiedades", admin); 
router.get('/cerrar-sesion', cerrarSesion);


// ==========================================
// RUTAS DE AUTENTICACIÓN (Vistas Pug)
// ==========================================

router.get("/login", formularioLogin);
router.post("/login", autenticarUsuario); 

router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);

router.get("/recuperar", formualrioRecuperar);
router.post("/recuperar", resetearPassword); 

// Confirmación de cuenta (Registro inicial)
router.get("/confirma/:token", paginaConfirmacion);

// --- RUTA DE DESBLOQUEO DE CUENTA (NUEVA) ---
// Esta es la ruta que procesa el clic desde el correo de bloqueo
router.get("/desbloquear/:token", desbloquearCuenta); 

// Reestablecer Password
router.get("/actualizarPassword/:token", formularioActualizacionPassword);
router.post("/actualizarPassword/:token", actualizarPassword); 

router.get("/registro2", formularioRegistro2);


// ==========================================
//     RUTAS DE REDES SOCIALES (OAuth2)
// ==========================================

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        res.redirect('/auth/mis-propiedades'); 
    }
);

router.get('/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));

router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        res.redirect('/auth/mis-propiedades'); 
    }
);


// ==========================================
//   ENDPOINTS DE PRUEBA / API (JSON)
// ==========================================

router.get("/", (req, res) => {
    res.json({
        status: 200, 
        message: "Solicitud recibida a través del método GET"
    });
});

export default router;