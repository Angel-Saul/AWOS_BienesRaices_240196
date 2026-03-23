import jwt from 'jsonwebtoken';

// Token para confirmación de cuentas (El que ya tenías)
const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "ASbm-26";

// Token para Sesión de Usuario (JWT)
// Este es el que nos permitirá sacar tu nombre de la DB
// const generarJWT = (datos) => jwt.sign(
//     { id: datos.id, nombre: datos.nombre }, 
//     process.env.JWT_SECRET, 
//     { expiresIn: '1d' } // La sesión dura 1 día
// );

const generarJWT = id => jwt.sign({
    id, 
    nombre: 'Angel Saul Barrios Completo',
    programEducativo: 'DSM',
    asignatura :'Aplicaciones Web Orientada a Servicios',
    tecnologias: 'API REST, NodeJS, Express y Sequalize'
}, process.env.JWT_SECRET, {expiresIn: '1d'});


// const genrarJWT2 = id => JsonWebTokenError.sign({
//     id, 
//     nombre: 'Angel Saul Barrios Completo',
//     programEducativo: 'DSM',
//     asignatura :'Aplicaciones Web Orientada a Servicios',
//     tecnologias: 'API REST, NodeJS, Express y Sequalize'
// }, process.env.JWT_SECRET, {expiresIn: '1d'});

export {
    generarToken,
    generarJWT
}