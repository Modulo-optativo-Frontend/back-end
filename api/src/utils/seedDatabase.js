// Inserta productos demo si la colección está vacía.
const Producto = require("../models/Producto");
const { macbooks, buildId } = require("../data/seedProductos");

async function seedDatabase() {
	// Evita duplicados: solo se inserta si no hay productos.
	const cantidadProductosEnBaseDeDatos = await Producto.countDocuments();
	if (cantidadProductosEnBaseDeDatos > 0) return;

	const productosParaInsertar = macbooks.map((productoBase) => ({
		...productoBase,
		idAlfaNumerico: buildId(
			productoBase.nombre,
			productoBase.anio,
			productoBase.codigoSku
		),
	}));

	await Producto.insertMany(productosParaInsertar);
	console.log("Seed de productos insertado (DB estaba vacia)");
}

module.exports = seedDatabase;
