import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
// import { Strategy as DiscordStrategy } from 'passport-discord'; // Si lo usas
import Usuario from '../models/usuario.js';

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        // 1. Extraer solo lo necesario del perfil social
        const emailSocial = profile.emails[0].value;
        const nombreSocial = profile.displayName || profile.username;

        // 2. Buscar si ya existe
        let usuario = await Usuario.findOne({ where: { email: emailSocial } });

        if (!usuario) {
            // 3. REGISTRO: Solo usamos los campos de tu tabla tb_usuarios
            usuario = await Usuario.create({
                nombre: nombreSocial,
                email: emailSocial,
                password: '', // Se deja vacío porque no usa password local
                confirmado: 1, // Marcamos como 1 (true) directamente
                reg_status: 1  // Según tu tabla, el valor por defecto es 1
            });
            console.log(`Nuevo usuario registrado vía GitHub: ${nombreSocial}`);
        }

        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
  }
));

// Necesario para mantener la sesión activa
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
});

export default passport;