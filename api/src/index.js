require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const conectarBaseDeDatos = require("./config/db");

const app = express();

const origenPermitido = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: origenPermitido }));
app.use(express.json());
app.use("/images/macbooks", express.static(path.join(__dirname, "data")));

// Rutas
const rutasProductos = require("./routes/productoRoutes.js");
const rutasUsuarios = require("./routes/usuarioRoutes.js");
const rutasCarrito = require("./routes/carritoRoutes.js");
const rutasPedidos = require("./routes/pedidoRoutes.js");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api/productos", rutasProductos);
app.use("/api/usuarios", rutasUsuarios);
app.use("/api/carrito", rutasCarrito);
app.use("/api/pedidos", rutasPedidos);

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
	// Primero conectamos con la base de datos.
	await conectarBaseDeDatos();

	app.listen(PORT, () => {
		console.log(`Servidor escuchando en el puerto ${PORT}`);
	});
}

iniciarServidor().catch((error) => {
	console.error("Error arrancando servidor:", error.message);
	process.exit(1);
});
