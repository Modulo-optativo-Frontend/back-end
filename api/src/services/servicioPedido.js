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

const checkout = async (userId) => {
	// 1. Obtener el carrito del usuario con los productos poblados
	const carrito = await Carrito.findOne({
		usuario: userId,
	}).populate("items.producto");

	// 2. Validar existencia y contenido del carrito
	if (!carrito) {
		throw new Error("Carrito no encontrado");
	}

	if (carrito.items.length === 0) {
		throw new Error("El carrito está vacío");
	}

	// 3. Transformar items del carrito en items del pedido
	const itemsPedido = [];
	let total = 0;

	for (const item of carrito.items) {
		// Validar que el producto exista
		if (!item.producto) {
			throw new Error("Uno de los productos ya no existe");
		}

		// Validar disponibilidad
		if (item.producto.enStock === false) {
			throw new Error(`Producto sin stock: ${item.producto.nombre}`);
		}

		const precioActual = item.producto.precio;
		const subtotal = precioActual * item.cantidad;

		// Añadir al array del pedido
		itemsPedido.push({
			producto: item.producto._id,
			cantidad: item.cantidad,
			precioUnitario: precioActual,
		});

		// Acumular total
		total += subtotal;
	}

	// 4. Crear el pedido
	const pedido = await Pedido.create({
		usuario: userId,
		items: itemsPedido,
		total,
		estado: "pendiente",
		// direccionEnvio: body.direccionEnvio (si se implementa)
	});

	// 5. Vaciar carrito tras confirmación
	carrito.items = [];
	await carrito.save();

	// 6. Devolver pedido creado
	return pedido;
};

// Exportar todos los servicios
module.exports = {
	crearPedido,
	obtenerPedidos,
	actualizarPedido,
	eliminarPedido,
	checkout,
};
