const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "ASbm-26";//Generar token aleatorio

export {generarToken}
