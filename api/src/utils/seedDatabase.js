// Inserta productos demo si la colección está vacía.
const Producto = require("../models/Producto");
const { macbooks, buildId } = require("../data/seedProductos");

async function seedDatabase() {
	// Evita duplicados: solo se inserta si no hay productos.
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
