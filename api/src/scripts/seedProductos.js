// Script manual de seed (se ejecuta con npm run seed).
require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("../models/Producto");
const { macbooks, buildId } = require("../data/seedProductos");

async function seed() {
	// Conecta y hace upsert por SKU para evitar duplicados.
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI no esta definido");
	}

	await mongoose.connect(process.env.MONGO_URI);
	console.log("MongoDB conectado para seed");

	for (const item of macbooks) {
		// Añade idAlfaNumerico antes de guardar.
		const data = {
			...item,
			idAlfaNumerico: buildId(item.nombre, item.anio),
		};

		await Producto.findOneAndUpdate(
			{ codigoSku: item.codigoSku },
			data,
			{ upsert: true, new: true, runValidators: true }
		);
	}

	console.log("Seed de productos completado");
	await mongoose.disconnect();
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
