import express from "express";
import passport from 'passport'; 
import { generarJWT } from '../lib/token.js';
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
    desbloquearCuenta 
} from '../controllers/usuarioController.js';

const router = express.Router();

// Rutas Privadas
router.get("/mis-propiedades", admin); 
router.get('/cerrar-sesion', cerrarSesion);

// Rutas Públicas
router.get("/login", formularioLogin);
router.post("/login", autenticarUsuario); 
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);
router.get("/recuperar", formualrioRecuperar);
router.post("/recuperar", resetearPassword); 
router.get("/confirma/:token", paginaConfirmacion);
router.get("/desbloquear/:token", desbloquearCuenta); 
router.get("/actualizarPassword/:token", formularioActualizacionPassword);
router.post("/actualizarPassword/:token", actualizarPassword); 
router.get("/registro2", formularioRegistro2);

// ==========================================
//    RUTAS DE REDES SOCIALES (OAuth2)
// ==========================================

// --- GITHUB ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/auth/login',
        keepSessionInfo: true 
    }),
    (req, res) => {
        const token = generarJWT({ id: req.user.id, nombre: req.user.nombre });
        return res.cookie('_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        }).redirect('/auth/mis-propiedades'); 
    }
);

// --- DISCORD ---
router.get('/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));

router.get('/discord/callback', 
    passport.authenticate('discord', { 
        failureRedirect: '/auth/login',
        keepSessionInfo: true 
    }),
    (req, res) => {
        // Verificamos que req.user exista antes de generar el token
        if(!req.user) return res.redirect('/auth/login');

        const token = generarJWT({ id: req.user.id, nombre: req.user.nombre });

        return res.cookie('_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        }).redirect('/auth/mis-propiedades'); 
    }
);

export default router;