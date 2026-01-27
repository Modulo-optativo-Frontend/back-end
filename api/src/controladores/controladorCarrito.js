const carritoService = require("../services/servicioCarrito");

// GET /api/carrito
const obtenerCarrito = async (req, res) => {
	try {
		const usuarioId = req.user.id; // 👈 CLAVE
		const carrito =
			await carritoService.getCarritoByUserId(usuarioId);
		return res.json({ items: carrito.items });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error obteniendo carrito" });
	}
};

// POST /api/carrito/items
const agregarItem = async (req, res) => {
	try {
		const usuarioId = req.user.id; // 👈 CLAVE
		const { productoId } = req.body;

		if (!productoId) {
			return res
				.status(400)
				.json({ message: "productoId requerido" });
		}

		const carrito = await carritoService.addItem(
			usuarioId,
			productoId,
		);
		return res.json({ items: carrito.items });
	} catch (err) {
		return res.status(500).json({ message: "Error añadiendo item" });
	}
};

// DELETE /api/carrito/items/:productoId
const quitarItem = async (req, res) => {
	try {
		const usuarioId = req.user.id; // 👈 CLAVE
		const { productoId } = req.params;

		const carrito = await carritoService.removeItem(
			usuarioId,
			productoId,
		);
		return res.json({ items: carrito.items });
	} catch (err) {
		return res.status(500).json({ message: "Error quitando item" });
	}
};

// DELETE /api/carrito
const vaciarCarrito = async (req, res) => {
	try {
		const usuarioId = req.user.id; // 👈 CLAVE
		const carrito = await carritoService.clearCarrito(usuarioId);
		return res.json({ items: carrito.items });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error vaciando carrito" });
	}
};

module.exports = {
	obtenerCarrito,
	agregarItem,
	quitarItem,
	vaciarCarrito,
};
