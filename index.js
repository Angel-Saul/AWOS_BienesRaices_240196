import express from "express";
import session from "express-session"; 
import passport from "passport"; 
import dotenv from "dotenv"; 
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./config/db.js";
import "./config/passport.js"; 
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

dotenv.config();
const app = express();

// 1. Middlewares básicos de lectura
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());

// 2. Configurar Sesiones (DEBE IR ANTES QUE PASSPORT Y CSURF)
app.use(session({
    secret: process.env.SESSION_SECRET || "PC-BienesRaices_240196_csrf_secret",
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.MODE_ENV === "production"
    }
}));

// 3. Inicializar Passport (AHORA SÍ, DESPUÉS DE LA SESIÓN)
app.use(passport.initialize());
app.use(passport.session());

// 4. Protección CSRF
app.use(csurf());

// 5. Middleware para pasar el Token a las vistas (Ojo: corregí 'crsfToken' a 'csrfToken')
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Cambié crsf por csrf (el estándar)
    next();
});

// 6. Configuraciones de Vista y Estáticos
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// 7. Rutas
app.use("/auth", usuarioRoutes);

// 8. Conexión a DB e inicio de servidor
await connectDB();

const PORT = process.env.PORT ?? 40196; // Usando tu puerto personalizado
app.listen(PORT, ()=> {
    console.log(`El servidor está iniciado en el puerto ${PORT}`)
})