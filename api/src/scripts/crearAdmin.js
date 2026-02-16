require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");

async function crearOActualizarAdmin() {
	const mongoUri = process.env.MONGO_URI;
	const nombreAdmin = process.env.ADMIN_NAME || "Administrador";
	const emailAdmin = process.env.ADMIN_EMAIL;
	const passwordAdmin = process.env.ADMIN_PASSWORD;

	if (!mongoUri) {
		throw new Error("Falta MONGO_URI en el archivo .env");
	}

	if (!emailAdmin || !passwordAdmin) {
		throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD en .env");
	}

	if (passwordAdmin.length < 8) {
		throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
	}

	await mongoose.connect(mongoUri);
	console.log("MongoDB conectada");

	let usuario = await Usuario.findOne({ email: emailAdmin });

	if (!usuario) {
		usuario = new Usuario({
			name: nombreAdmin,
			email: emailAdmin,
			password: passwordAdmin,
			role: "admin",
		});

		await usuario.save();
		console.log(`Admin creado: ${emailAdmin}`);
	} else {
		usuario.name = nombreAdmin;
		usuario.role = "admin";
		usuario.password = passwordAdmin;
		await usuario.save();
		console.log(`Usuario actualizado a admin: ${emailAdmin}`);
	}

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
