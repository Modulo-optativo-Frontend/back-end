// Importar el servicio de productos
const productoServicio = require("../services/servicioProducto.js");

// Controlador para crear un nuevo producto
const crearProducto = async (req, res) => {
	try {
		// Llamar al servicio para crear el producto con los datos del body
		const producto = await productoServicio.crearProducto(req.body);
		// Responder con éxito y los datos del producto creado
		res.status(201).json({ status: "success", data: producto }); // Corregido: era 'product'
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

// Controlador para obtener todos los productos
const obtenerProductos = async (req, res) => {
	try {
		// Llamar al servicio para obtener todos los productos
		const productos = await productoServicio.obtenerProductos();
		// Responder con éxito y la lista de productos
		res.status(200).json({ status: "success", data: productos });
	} catch (error) {
		// Responder con error del servidor si algo falla
		res.status(500).json({ status: "error", message: error.message });
	}
};
const obtenerProductoPorId = async (req, res) => {
	try {
		// Llamar al servicio para obtener el producto por ID de MongoDB
		const producto = await productoServicio.obtenerProductoPorId(req.params.id);

		// Verificar si el producto existe
		if (!producto) {
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}

		// Responder con éxito y el producto encontrado
		res.status(200).json({ status: "success", data: producto });
	} catch (error) {
		// Responder con error del servidor si algo falla
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Controlador para actualizar un producto
const actualizarProducto = async (req, res) => {
	try {
		// Llamar al servicio para actualizar el producto por ID
		const producto = await productoServicio.actualizarProducto(
			req.params.id,
			req.body
		);
		// Verificar si el producto existe
		if (!producto) {
			// Responder con error 404 si no se encuentra
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}
		// Responder con éxito y el producto actualizado
		res.status(200).json({ status: "success", data: producto });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

// Controlador para eliminar un producto
const eliminarProducto = async (req, res) => {
	try {
		// Llamar al servicio para eliminar el producto por ID
		const producto = await productoServicio.eliminarProducto(req.params.id);
		// Verificar si el producto existe
		if (!producto) {
			// Responder con error 404 si no se encuentra
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}
		// Responder con éxito y el producto eliminado
		res.status(200).json({ status: "success", data: producto });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

// Exportar todos los controladores
module.exports = {
	crearProducto,
	obtenerProductos,
	actualizarProducto,
	eliminarProducto,
	obtenerProductoPorId,
};
