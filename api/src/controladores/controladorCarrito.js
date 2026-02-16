const carritoService = require("../services/servicioCarrito");

function obtenerUsuarioIdDesdeToken(user = {}) {
	return user.id || user._id || null;
}

function responderError(res, err, mensajePorDefecto) {
	return res
		.status(err.statusCode || 500)
		.json({ message: err.message || mensajePorDefecto });
}

// GET /api/carrito
const obtenerCarrito = async (req, res) => {
	try {
		const usuarioId = obtenerUsuarioIdDesdeToken(req.user);
		const carrito =
			await carritoService.getCarritoByUserId(usuarioId);
		return res.json({ items: carrito.items });
	} catch (err) {
		return responderError(res, err, "Error obteniendo carrito");
	}
};

// POST /api/carrito/items
const agregarItem = async (req, res) => {
	try {
		const usuarioId = obtenerUsuarioIdDesdeToken(req.user);
		const { productoId } = req.body;

		const carrito = await carritoService.addItem(
			usuarioId,
			productoId,
		);
		return res.json({ items: carrito.items });
	} catch (err) {
		return responderError(res, err, "Error añadiendo item");
	}
};

// DELETE /api/carrito/items/:productoId
const quitarItem = async (req, res) => {
	try {
		const usuarioId = obtenerUsuarioIdDesdeToken(req.user);
		const { productoId } = req.params;

		const carrito = await carritoService.removeItem(
			usuarioId,
			productoId,
		);
		return res.json({ items: carrito.items });
	} catch (err) {
		return responderError(res, err, "Error quitando item");
	}
};

// DELETE /api/carrito
const vaciarCarrito = async (req, res) => {
	try {
		const usuarioId = obtenerUsuarioIdDesdeToken(req.user);
		const carrito = await carritoService.clearCarrito(usuarioId);
		return res.json({ items: carrito.items });
	} catch (err) {
		return responderError(res, err, "Error vaciando carrito");
	}
};

module.exports = {
	obtenerCarrito,
	agregarItem,
	quitarItem,
	vaciarCarrito,
};
