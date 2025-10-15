const Producto = require("../models/Producto.js");

const crearProducto = async (productoData) => {
	const newProducto = new Producto(productoData);
	return await newProducto.save();
};

module.exports = {
	crearProducto,
};
