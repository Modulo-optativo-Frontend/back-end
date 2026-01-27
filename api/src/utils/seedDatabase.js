const Producto = require("../models/Producto");
const { macbooks, buildId } = require("../data/seedProductos");

async function seedDatabase() {
	const totalProductos = await Producto.countDocuments();
	if (totalProductos > 0) return;

	const productos = macbooks.map((item) => ({
		...item,
		idAlfaNumerico: buildId(item.nombre, item.anio),
	}));

	await Producto.insertMany(productos);
	console.log("Seed de productos insertado (DB estaba vacia)");
}

module.exports = seedDatabase;
