require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
connectDB();

// Importar las rutas de productos
const productRoutes = require("./routes/productoRoutes.js");
const usuarioRoutes = require("./routes/usuarioRoutes.js");
const carritoRoutes = require("./routes/carritoRoutes.js");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api/productos", productRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/carrito", carritoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
