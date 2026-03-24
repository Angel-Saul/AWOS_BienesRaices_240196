import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import session from "express-session";
// CORRECCIÓN 1: Importamos passport DESDE tu archivo de configuración, no directamente de la librería
import passport from "./config/passport.js"; 
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

const app = express();

// 1. Middlewares básicos
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());

// 2. Configurar Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || "PC-BienesRaices_240196_csrf_secret",
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        // CORRECCIÓN 2: El nombre de la variable suele ser NODE_ENV
        secure: process.env.NODE_ENV === "production" 
    }
}));

// 3. Inicializar Passport (Importante: después de session)
app.use(passport.initialize());
app.use(passport.session());

// 4. Protección CSRF
app.use(csurf());

// 5. Middleware para pasar el Token y el Usuario a las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    // CORRECCIÓN 3: Pasar el usuario de passport a las vistas (útil para el layout)
    res.locals.usuario = req.user || null; 
    next();
});

// 6. Configuraciones de Vista y Estáticos
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// 7. Rutas
app.use("/auth", usuarioRoutes);

// 8. Conexión a DB
await connectDB();

// Manejo de error CSRF
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("template/mensaje", {
            pagina: "Error de seguridad",
            mensaje: "El formulario expiró o fue manipulado. Recarga la página."
        });
    }
    next(err);
});

const PORT = process.env.PORT ?? 40196;
app.listen(PORT, ()=> {
    console.log(`El servidor está iniciado en el puerto ${PORT}`)
});