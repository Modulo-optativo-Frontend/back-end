// 1. Cargar variables de entorno (del archivo .env)
require("dotenv").config();

// 2. Importar librerías principales
// Importar Express para crear el servidor web
const express = require("express");
// Importar función para conectar a la base de datos
const connectDB = require("./config/db");

// 3. Crear aplicación Express
const app = express();

// 4. Middleware: para que Express entienda JSON en las peticiones
app.use(express.json());

// 5. Conectar a la base de datos Mongo
connectDB();

// Importar las rutas de productos
const productRoutes = require("./routes/productoRoutes.js");
const usuarioRoutes = require("./routes/usuarioRoutes.js");

// 6. Definir una ruta de prueba que sirve el archivo HTML
app.get("/", (req, res) => {
	// Enviar archivo HTML desde la carpeta actual
	res.sendFile(__dirname + "/index.html");
});

// 7. Usar las rutas con prefijo /api/
app.use("/api/productos", productRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Escuchar en el puerto definido en .env o por defecto 3000
const PORT = process.env.PORT || 3000;
// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
	// Mostrar mensaje cuando el servidor esté listo
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
