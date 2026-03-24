import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import Usuario from '../models/usuario.js';

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

// ESTRATEGIA DE GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email'] 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            const passwordSeguro = Math.random().toString(36).slice(-10) + "GitH789!";
            usuario = await Usuario.create({
                nombre: profile.displayName || profile.username,
                email: email,
                password: passwordSeguro,
                confirmado: 1
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

// ESTRATEGIA DE DISCORD
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.email;
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            const passwordSeguro = Math.random().toString(36).slice(-10) + "D1sc0rd!";
            usuario = await Usuario.create({
                // Importante: usamos 'nombre' para que coincida con tu tabla
                nombre: profile.global_name || profile.username, 
                email: email,
                password: passwordSeguro,
                confirmado: 1
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport;