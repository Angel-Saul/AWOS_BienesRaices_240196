import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./config/db.js"; //Importamos la instancia de Sequelize para establecer la conexión con la base de datos y gestionar las operaciones de esta 


const app = express(); //Creamos una instancia de Express, la cual se encarga de gestionar las rutas, las peticiones y las respuestas del servidor
const PORT = process.env.PORT ?? 3000; //Puerto en el que se va a ejecutar el servidor, si no se especifica un puerto en las variables de entorno, se utilizará el puerto 3000 por defecto


//Habilitar Pug
app.set('view engine', 'pug'); //Establecemos el motor de plantillas que vamos a utilizar para renderizar las vistas, en este caso, Pug
app.set('views', './views'); //Establecemos la carpeta donde se encuentran las vistas, en este caso, la carpeta "views" que se encuentra en la raíz del proyecto

//Definimos la carpeta publica
app.use(express.static('public')); //Habilitamos el uso de archivos estáticos, como imágenes, estilos CSS y scripts JavaScript, que se encuentran en la carpeta "public" que se encuentra en la raíz del proyecto

//Habilitamos el uso de datos codificados en la URL, lo que permite procesar los datos enviados desde los formularios HTML. La opción extended: true permite procesar datos complejos, como objetos anidados, lo que es útil para manejar formularios con múltiples campos y estructuras de datos más complejas.
//Habilitar lectura de datos atraves de kas petisiones (Request)
app.use(express.urlencoded({extended: true})); 

//Importamos sus rutas (ruteo)
app.use("/auth", usuarioRoutes); //Habilitamos el uso de las rutas definidas en el archivo "usuarioRoutes.js", las cuales se encuentran bajo la ruta "/auth"
await connectDB(); //Establecemos la conexión con la base de datos antes de iniciar el servidor, para asegurarnos de que la conexión se ha establecido correctamente antes de que el servidor comience a aceptar peticiones

app.listen(PORT, ()=> { //Iniciamos el servidor en el puerto especificado y mostramos un mensaje en la consola indicando que el servidor se ha iniciado correctamente
    console.log(`El servidor esta iniciado en el puerto ${PORT}`) //Si el servidor se inicia correctamente, se muestra un mensaje en la consola indicando el puerto en el que se está ejecutando el servidor
}) 