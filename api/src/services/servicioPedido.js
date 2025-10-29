const Pedido = require("../models/Pedido.js");

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
// Exportar todos los servicios
module.exports = {
	crearPedido,
	obtenerPedidos,
	actualizarPedido,
	eliminarPedido,
};
