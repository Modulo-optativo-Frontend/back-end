const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const { macbooks, buildId } = require("../data/seedProductos");

async function seedProductos() {
	for (const productoBase of macbooks) {
		const productoFinal = {
			...productoBase,
			idAlfaNumerico: buildId(productoBase),
		};

		await Producto.findOneAndUpdate(
			{ codigoSku: productoBase.codigoSku },
			productoFinal,
			{ upsert: true, new: true, runValidators: true }
		);
	}

	console.log("Seed de productos sincronizado");
}

async function ensureAdminUser() {
	const nombreAdmin = process.env.ADMIN_NAME || "Administrador";
	const emailAdmin = process.env.ADMIN_EMAIL;
	const passwordAdmin = process.env.ADMIN_PASSWORD;

	if (!emailAdmin || !passwordAdmin) {
		console.log(
			"Seed de admin omitido: faltan ADMIN_EMAIL o ADMIN_PASSWORD en el .env"
		);
		return;
	}

	if (passwordAdmin.length < 8) {
		throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
	}

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
		return;
	}

	usuario.name = nombreAdmin;
	usuario.role = "admin";
	usuario.password = passwordAdmin;
	await usuario.save();
	console.log(`Admin habilitado/actualizado: ${emailAdmin}`);
}

async function seedDatabase() {
	await seedProductos();
	await ensureAdminUser();
}

module.exports = {
	seedDatabase,
	seedProductos,
	ensureAdminUser,
};
