const productoServicio = require("../services/productoServicio.js");
const crearProducto = async (req, res) => {
	try {
		const producto = await productoServicio.createProduct(req.body);
		res.status(201).json({ status: "success", data: product });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};
module.exports = {
	crearProducto,
};
