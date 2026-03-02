// import express from "express"
// import { 
//     formularioLogin, 
//     registrarUsuario, 
//     formularioRegistro, 
//     formularioRegistro2, // Importamos la nueva función
//     formualrioRecuperar 
// } from '../controllers/usuarioController.js';

// const router = express.Router();

// // ==========================================
// // RUTAS DE AUTENTICACIÓN (Vistas Pug)
// // ==========================================

// // Login tradicional
// router.get("/login", formularioLogin);

// // Registro estándar
// router.get("/registro", formularioRegistro);
// router.post("/registro", registrarUsuario);

// // Registro/Login Estilo Redes Sociales (GitHub y Discord)
// // CORRECCIÓN: Antes apuntaba a formularioRegistro, ahora a formularioRegistro2
// router.get("/registro2", formularioRegistro2);

// // Recuperación de contraseña
// router.get("/recuperar", formualrioRecuperar);


// // ==========================================
// // ENDPOINTS DE PRUEBA / API (JSON)
// // ==========================================

// // Root de usuarios
// router.get("/", (req, res) => {
//     console.log("Bienvenid@ al sistema de Bienes Raices");
//     res.json({
//         status: 200, 
//         message: "Solicitud recibida a través del método GET"
//     });
// });

// // Ejemplo POST denegado en root
// router.post("/", (req, res) => {
//     res.json({
//         status: 200, 
//         message: "Lo sentimos, no se aceptan peticiones POST en esta raíz"
//     });
// });

// // Crear Usuario (Simulación)
// router.post("/createUser", (req, res) => {
//     const nuevoUsuario = {
//         nombre: "Angel Saúl Barrios Martinez",
//         correo: "240196@utxicotepec.edu.mx"
//     };
//     res.json({
//         status: 200,
//         message: `Se ha solicitado la creación de: ${nuevoUsuario.nombre}`,
//     });
// });

// // Actualizar Usuario (Simulación PUT)
// router.put("/updateUser", (req, res) => {
//     res.json({
//         status: 200,
//         message: "Se ha solicitado la actualización completa de los datos"
//     });
// });

// // Actualizar Password (Simulación PATCH)
// router.patch("/updatePassword/:nuevoPassword", (req, res) => {
//     const { nuevoPassword } = req.params;
//     res.json({
//         status: 200,
//         message: `Actualización parcial de contraseña a: ${nuevoPassword}`
//     });
// });

// // Eliminar Propiedad (Simulación DELETE)
// router.delete("/deleteProperty/:id", (req, res) => {
//     const { id } = req.params;
//     res.json({
//         status: 200,
//         message: `Se ha solicitado eliminar la propiedad con el id ${id}`
//     });
// });

// // Saludo Dinámico
// router.get("/saludo/:nombre", (req, res) => {
//     const { nombre } = req.params;
//     res.status(200).send(`<h1>Bienvenido <b>${nombre}</b></h1>`);
// });

// export default router;


import express from "express"
import passport from 'passport'; // Necesario para las rutas de redes sociales
import { 
    formularioLogin, 
    registrarUsuario, 
    formularioRegistro, 
    formularioRegistro2, 
    formualrioRecuperar 
} from '../controllers/usuarioController.js';

const router = express.Router();

// ==========================================
// RUTAS DE AUTENTICACIÓN (Vistas Pug)
// ==========================================

// Login tradicional
router.get("/login", formularioLogin);

// Registro estándar (Manual)
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);

// Registro/Login Estilo Redes Sociales (Tu diseño de examen)
router.get("/registro2", formularioRegistro2);

// Recuperación de contraseña
router.get("/recuperar", formualrioRecuperar);


// ==========================================
//   RUTAS DE REDES SOCIALES (OAuth2)
// ==========================================

// --- GITHUB ---
// Al dar clic en el botón de GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub (donde regresa el usuario)
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        // Si todo sale bien, lo mandamos al inicio o panel
        res.redirect('/'); 
    }
);

// --- DISCORD ---
// Al dar clic en el botón de Discord
router.get('/discord', passport.authenticate('discord', { scope: ['identify', 'email'] }));

// Callback de Discord
router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/auth/registro2' }),
    (req, res) => {
        res.redirect('/');
    }
);


// ==========================================
// ENDPOINTS DE PRUEBA / API (JSON)
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

// Crear Usuario (Simulación)
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