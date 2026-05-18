require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const rutasCheckout = require("./routes/checkoutRoutes.js");
const requestId = require("./middleware/requestId");
const httpLogger = require("./middleware/httpLogger");
const observableErrors = require("./middleware/observableErrors");
const errorHandler = require("./middleware/errorHandler");

const conectarBaseDeDatos = require("./config/db");
const { seedDatabase } = require("./utils/seedDatabase");

const app = express();

const origenPermitido = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(requestId);
app.use(httpLogger);
app.use(observableErrors);
app.use(cors({ origin: origenPermitido }));
app.use("/api/checkout", rutasCheckout);

app.use(express.json());
app.use("/images/macbooks", express.static(path.join(__dirname, "data")));

// Rutas
const rutasProductos = require("./routes/productoRoutes.js");
const rutasUsuarios = require("./routes/usuarioRoutes.js");
const rutasCarrito = require("./routes/carritoRoutes.js");
const rutasPedidos = require("./routes/pedidoRoutes.js");
const healthRoutes = require("./routes/healthRoutes.js");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", healthRoutes);
app.use("/api/productos", rutasProductos);
app.use("/api/usuarios", rutasUsuarios);
app.use("/api/carrito", rutasCarrito);
app.use("/api/pedidos", rutasPedidos);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (!PORT) {
	throw new Error("Hay un error al leer a variable PORT");
}

async function iniciarServidor() {
	await conectarBaseDeDatos();
	await seedDatabase();

	app.listen(PORT, () => {
		console.log(`Servidor escuchando en el puerto ${PORT}`);
	});
}

iniciarServidor().catch((error) => {
	console.error("Error arrancando servidor:", error.message);
	process.exit(1);
});
