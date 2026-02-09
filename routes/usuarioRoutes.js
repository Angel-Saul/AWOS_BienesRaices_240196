import express from "express";

//creamos el ruteador

const router = express.Router();

//Definimos las rutas 
        
//Ejemplo de ENDPOINT GET 
router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices")
    res.json({
        status:200, 
        message: "Solicitud recibida através del metodo GET"
    })
})

//Ejemplo de ENDPOINT POST
router.post("/", (req, res) => {
    console.log("Se ha recibido una petición tipo POST")
    res.json({
        status:200, 
        message: "Lo sentimos, no se aceptan peticiones POST"
    })
})

//Ejemplo de un ENDPOINT POST - Simular la creacionde un nuevo usuario
router.post("/createUser", (req, res) => {
    console.log("Se ha solicitado crear un nuevo usuario.")
    const nuevoUsuario = 
    {
        nombre: "Angel Saúl Barrios Martinez",
        correo:  "240196@utxicotepec.edu.mx"
    }
    res.json({
        status:200,
        message: `Se he solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo ${nuevoUsuario.correo}`,
    })
})

//Ejemplo de un ENPOINT PUT - Simular la actualización de los datos de un usuario creado 
router.put("/updateUser", (req, res) => {
    console.log("Se ha solicitado ka actualización de los datos del usuario, siendo PUT una actualizacón completa")
        const usuario = 
    {
        nombre: " Angel Saúl Barrios Martinez",
        correo:  "240196@utxicotepec.edu.mx"
    }
    const usuarioActualizado =
    {
        nombre: "Angel Saúl",
        correo: "angelmua@gmail.com"
    }
    res.json ({
        status: 200,
        message: `Se he solicitado la actualización completa delos datos de nombre: ${usuario.nombre} y correo ${usuario.correo} a ${usuarioActualizado.nombre} y correo ${usuarioActualizado.correo}`,
    })
})

//Ejemplo de un ENDPOINT PATCH - Simular la actualización de la contraseña del usuario
router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    console.log("Se ha solicitado la actualización de la contraseña, siendo PATCH una actualización parcial")
    const usuario = 
    {
        nombre: " Angel Saúl Barrios Martinez",
        correo:  "240196@utxicotepec.edu.mx",
        password: "12345678"
    }
    const nuevoPassword = "1234";
    res.json ({
        status: 200,
        message: `Se ha solicitadi la actualización parcial de la contraseña del usuario de nombre 
        ${usuario.nombre} y correo ${usuario.correo} de la contraseña ${usuario.password} a ${nuevoPassword}`
    })
})


router.get("/login", (req, res) => {
    console.log("El usuario desea acceder al sistema")
    res.status(200).send(`<h1>Por favor introduce tus credenciales de acceso </h1>
        <form>
            <input type="text"></input><br>
            <input type="password"></input><br>
            <button>Enviar</button>
        </form>`);
})

router.get("/saludo/:nombre", (req, res)=>
    {
        const {nombre} = req.params;
        console.log(`El usuario: ${nombre}`)
        res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p> </h1`)       
    })

export default router;