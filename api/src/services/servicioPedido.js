const Carrito = require("../models/Carrito");
const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");

// ─── Helpers ─────────────────────────────────────────────────────────────────

class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

// ─── Servicios CRUD básicos ───────────────────────────────────────────────────

const crearPedido = async (pedidoData) => {
	const nuevoPedido = new Pedido(pedidoData);
	return await nuevoPedido.save();
};

const obtenerPedidos = async () => {
	return await Pedido.find();
};

const actualizarPedido = async (id, data) => {
	return await Pedido.findByIdAndUpdate(id, data, { new: true });
};

const eliminarPedido = async (id) => {
	return await Pedido.findByIdAndDelete(id);
};

// ─── Checkout ─────────────────────────────────────────────────────────────────

const checkout = async (userId, stripeSessionId = null) => {
	// ← un parámetro añadido
	const carritoUsuario = await Carrito.findOne({ usuario: userId }).populate(
		"items.producto",
	);

	if (!carritoUsuario) throw new HttpError(404, "Carrito no encontrado");
	if (!carritoUsuario.items || carritoUsuario.items.length === 0)
		throw new HttpError(400, "El carrito está vacío");

	const itemsPedido = [];
	let total = 0;

	for (const item of carritoUsuario.items) {
		if (!item.producto)
			throw new HttpError(409, "Uno de los productos ya no existe");
		if (item.cantidad !== 1)
			throw new HttpError(400, "Cantidad inválida: producto único (1 ud)");

		const productoId = item.producto._id;

		const vendido = await Producto.findOneAndUpdate(
			{ _id: productoId, enStock: true },
			{ $set: { enStock: false } },
			{ new: true },
		);

		if (!vendido) throw new HttpError(409, "Producto ya vendido");

		itemsPedido.push({
			producto: productoId,
			cantidad: 1,
			precioUnitario: item.producto.precio,
		});
		total += item.producto.precio;
	}

	let pedido;
	try {
		pedido = await Pedido.create({
			usuario: userId,
			items: itemsPedido,
			total,
			estado: "pendiente",
			stripeSessionId,
		});
	} catch (err) {
		const productoId = itemsPedido[0]?.producto;
		if (productoId)
			await Producto.updateOne(
				{ _id: productoId },
				{ $set: { enStock: true } },
			);
		throw err;
	}

	carritoUsuario.items = [];
	await carritoUsuario.save();

	return pedido;
};

const obtenerPedidosPorUser = async (userId) => {
	return await Pedido.find({ usuario: userId })
		.populate("items.producto", "nombre precio imagenes modelo anio")
		.sort({ createdAt: -1 });
};

module.exports = {
	crearPedido,
	obtenerPedidos,
	actualizarPedido,
	eliminarPedido,
	checkout,
	obtenerPedidosPorUser,
};
