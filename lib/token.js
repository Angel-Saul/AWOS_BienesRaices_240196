import jwt from 'jsonwebtoken';

// Token para confirmación de cuentas (El que ya tenías)
const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "ASbm-26";

// Token para Sesión de Usuario (JWT)
// Este es el que nos permitirá sacar tu nombre de la DB
const generarJWT = (datos) => jwt.sign(
    { id: datos.id, nombre: datos.nombre }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' } // La sesión dura 1 día
);

export {
    generarToken,
    generarJWT
}