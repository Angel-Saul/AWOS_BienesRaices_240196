import express from "express"
import passport from 'passport'; // Necesario para las rutas de redes sociales
import { 
    formularioLogin, 
    autenticarUsuario, // <--- AGREGADO: Función para procesar el login
    registrarUsuario, 
    formularioRegistro, 
    formularioRegistro2, 
    formualrioRecuperar, 
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword,
    actualizarPassword
} from '../controllers/usuarioController.js';

const router = express.Router();

// ==========================================
// RUTAS DE AUTENTICACIÓN (Vistas Pug)
// ==========================================

// Login tradicional
router.get("/login", formularioLogin);
router.post("/login", autenticarUsuario); // <--- AGREGADO: Procesa el inicio de sesión

// Registro estándar (Manual)
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);

// Recuperación de contraseña
router.get("/recuperar", formualrioRecuperar);
router.post("/recuperar", resetearPassword); // <--- Asegurado: Procesa solicitud de token
router.get("/actualizarPassword/:token", formularioActualizacionPassword);
router.post("/actualizarPassword", actualizarPassword);

// Confirmación de cuenta vía Email
router.get("/confirma/:token", paginaConfirmacion);

// Registro/Login Estilo Redes Sociales (Diseño de examen)
router.get("/registro2", formularioRegistro2);


// ==========================================
//    RUTAS DE REDES SOCIALES (OAuth2)
// ==========================================

// --- GITHUB ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        res.redirect('/'); 
    }
);

// --- DISCORD ---
router.get('/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));

router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        res.redirect('/');
    }
);


// ==========================================
//  ENDPOINTS DE PRUEBA / API (JSON)
// ==========================================

// Root de usuarios
router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices");
    res.json({
        status: 200, 
        message: "Solicitud recibida a través del método GET"
    });
});

// Ejemplo POST denegado en root
router.post("/", (req, res) => {
    res.json({
        status: 200, 
        message: "Lo sentimos, no se aceptan peticiones POST en esta raíz"
    });
});

// Crear Usuario (Simulación API)
router.post("/createUser", (req, res) => {
    const nuevoUsuario = {
        nombre: "Angel Saúl Barrios Martinez",
        correo: "240196@utxicotepec.edu.mx"
    };
    res.json({
        status: 200,
        message: `Se ha solicitado la creación de: ${nuevoUsuario.nombre}`,
    });
});

// Actualizar Usuario (Simulación PUT)
router.put("/updateUser", (req, res) => {
    res.json({
        status: 200,
        message: "Se ha solicitado la actualización completa de los datos"
    });
});

// Actualizar Password (Simulación PATCH)
router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    const { nuevoPassword } = req.params;
    res.json({
        status: 200,
        message: `Actualización parcial de contraseña a: ${nuevoPassword}`
    });
});

// Eliminar Propiedad (Simulación DELETE)
router.delete("/deleteProperty/:id", (req, res) => {
    const { id } = req.params;
    res.json({
        status: 200,
        message: `Se ha solicitado eliminar la propiedad con el id ${id}`
    });
});

// Saludo Dinámico
router.get("/saludo/:nombre", (req, res) => {
    const { nombre } = req.params;
    res.status(200).send(`<h1>Bienvenido <b>${nombre}</b></h1>`);
});

export default router;