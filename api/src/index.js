require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

connectDB();

// Importar las rutas de productos
const productRoutes = require("./routes/productoRoutes.js");
const usuarioRoutes = require("./routes/usuarioRoutes.js");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use("/api/productos", productRoutes);
app.use("/api/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
