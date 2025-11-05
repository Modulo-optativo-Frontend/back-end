// Importar el modelo Producto
const Producto = require("../models/Producto.js");

// Servicio para crear un nuevo producto
const crearProducto = async (productData) => {
	// Crear nueva instancia del producto con los datos recibidos
	const nuevoProducto = new Producto(productData);
	// Guardar el producto en la base de datos y retornarlo
	return await nuevoProducto.save();
};

// Servicio para obtener todos los productos
const obtenerProductos = async () => {
	// Buscar y retornar todos los productos de la base de datos
	return await Producto.find();
};

// Servicio para obtener un producto por ID
const obtenerProductoPorId = async (id) => {
	// Buscar y retornar el producto por su ID de MongoDB
	return await Producto.findOne({ idAlfaNumerico: id });
};

// Servicio para actualizar un producto por ID
const actualizarProducto = async (id, data) => {
	// Buscar producto por ID, actualizarlo y retornar la versión actualizada
	return await Producto.findByIdAndUpdate(id, data, { new: true });
};

// Servicio para eliminar un producto por ID
const eliminarProducto = async (id) => {
	// Buscar producto por ID, eliminarlo y retornarlo
	return await Producto.findByIdAndDelete(id);
};

// Exportar todos los servicios
module.exports = {
	crearProducto,
	obtenerProductos,
	actualizarProducto,
	eliminarProducto,
	obtenerProductoPorId,
};
