// 1. Cargar variables de entorno (del archivo .env)
require("dotenv").config();

// 2. Importar librerías principales
const express = require("express");
const connectDB = require("./config/db");

// 3. Crear aplicación Express
const app = express();

// 4. Middleware: para que Express entienda JSON en las peticiones
app.use(express.json());

// 5. Conectar a la base de datos Mongo
connectDB();

// 6. Definir una ruta de prueba
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// 7. Escuchar en el puerto definido en .env o por defecto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
	
});
