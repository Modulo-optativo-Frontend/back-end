const Carrito = require("../models/Carrito");
const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");

// Servicio para crear un nuevo pedido
const crearPedido = async (pedidoData) => {
	// Crear nueva instancia del Pedido con los datos recibidos
	const nuevoPedido = new Pedido(pedidoData);
	// Guardar el Pedido en la base de datos y retornarlo
	return await nuevoPedido.save();
};

const obtenerPedidos = async () => {
	// Buscar y retornar todos los pedidos de la base de datos
	return await Pedido.find();
};

const actualizarPedido = async (id, data) => {
	// Buscar pedido por ID, actualizarlo y retornar la versión actualizada
	return await Pedido.findByIdAndUpdate(id, data, { new: true });
};

const eliminarPedido = async (id) => {
	// Buscar pedido por ID, eliminarlo y retornarlo
	return await Pedido.findByIdAndDelete(id);
};



class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

const checkout = async (userId) => {
	// 1) Carrito + populate
	const carritoUsuario = await Carrito.findOne({ usuario: userId }).populate(
		"items.producto",
	);

	if (!carritoUsuario) throw new HttpError(404, "Carrito no encontrado");
	if (!carritoUsuario.items || carritoUsuario.items.length === 0)
		throw new HttpError(400, "El carrito está vacío");
	
	const itemsPedido = [];
	let total = 0;

	// 2) Validar + vender (atómico)

	for (const item of carritoUsuario.items) {
		if (!item.producto)
			throw new HttpError(409, "Uno de los productos ya no existe");
		if (item.cantidad !== 1)
			throw new HttpError(400, "Cantidad inválida: producto único (1 ud)");

		const productoId = item.producto._id;

		// ✅ Venta ATÓMICA (anti doble compra)
		const vendido = await Producto.findOneAndUpdate(
			{ _id: productoId, enStock: true },
			{ $set: { enStock: false } },
			{ new: true },
		);

		if (!vendido) {
			throw new HttpError(409, "Producto ya vendido");
		}

		const precioActual = item.producto.precio;
		itemsPedido.push({
			producto: productoId,
			cantidad: 1,
			precioUnitario: precioActual,
		});

		total += precioActual;
	}

	// 3) Crear pedido
	let pedido;
	try {
		pedido = await Pedido.create({
			usuario: userId,
			items: itemsPedido,
			total,
			estado: "pendiente",
		});
	} catch (err) {
		const productoId = itemsPedido[0]?.producto;

		if (productoId) {
			await Producto.updateOne(
				{ _id: productoId },
				{ $set: { enStock: true } },
			);
		}
		throw err;
	}

	// 4) Vaciar carrito
	carritoUsuario.items = [];
	await carritoUsuario.save();

	return pedido;
};

const obtenerPedidosPorUser = async (userId) => {
	return await Pedido.find({ usuario: userId })
		.populate("items.producto", "nombre precio imagenes modelo anio")
		.sort({ createdAt: -1 });
};

// Exportar todos los servicios
module.exports = {
	crearPedido,
	obtenerPedidos,
	actualizarPedido,
	eliminarPedido,
	checkout,
	obtenerPedidosPorUser,
};
