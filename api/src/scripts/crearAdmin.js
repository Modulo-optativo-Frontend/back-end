require("dotenv").config();
const mongoose = require("mongoose");
const { ensureAdminUser } = require("../utils/seedDatabase");

async function crearOActualizarAdmin() {
	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error("Falta MONGO_URI en el archivo .env");
	}

	await mongoose.connect(mongoUri);
	console.log("MongoDB conectada");
	await ensureAdminUser();

	await mongoose.disconnect();
	console.log("Proceso completado");
}

crearOActualizarAdmin().catch(async (error) => {
	console.error("Error creando admin:", error.message);
	try {
		await mongoose.disconnect();
	} catch {
		// Ignorar errores al cerrar conexión en fallo.
	}
	process.exit(1);
});
