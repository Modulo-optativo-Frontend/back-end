const mongoose = require("mongoose");

const conectarBaseDeDatos = async () => {
	try {
		if (!process.env.MONGO_URI) {
			throw new Error("Falta MONGO_URI en el .env");
		}

		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB conectada correctamente");
	} catch (error) {
		console.error("Error de MongoDB:", error.message);
		process.exit(1);
	}
};

module.exports = conectarBaseDeDatos;
