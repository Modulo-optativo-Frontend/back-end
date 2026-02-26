const pedidoServicio = require("../services/servicioPedido.js");

// Controlador para crear un nuevo pedido
const crearPedido = async (req, res) => {
	try {
		// Llamar al servicio para crear el pedido con los datos del body
		await pedidoServicio.crearPedido(req.body);

		// Responder con exito
		res.status(201).json({
			status: "success",
			message: "Pedido creado exitosamente",
		});
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

const obtenerPedidos = async (req, res) => {
	try {
		// Llamar al servicio para obtener todos los pedidos
		const pedidos = await pedidoServicio.obtenerPedidos();
		// Responder con exito y la lista de pedidos
		res.status(200).json({ status: "success", data: pedidos });
	} catch (error) {
		// Responder con error del servidor si algo falla
		res.status(500).json({ status: "error", message: error.message });
	}
};

const actualizarPedido = async (req, res) => {
	try {
		// Llamar al servicio para actualizar el pedido por ID
		const pedido = await pedidoServicio.actualizarPedido(
			req.params.id,
			req.body,
		);

		// Verificar si el pedido existe
		if (!pedido) {
			// Responder con error 404 si no se encuentra
			return res
				.status(404)
				.json({ status: "error", message: "Pedido no encontrado" });
		}

		// Responder con exito y el pedido actualizado
		res.status(200).json({ status: "success", data: pedido });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

const eliminarPedido = async (req, res) => {
	try {
		// Llamar al servicio para eliminar el pedido por ID
		const pedido = await pedidoServicio.eliminarPedido(req.params.id);
		// Verificar si el pedido existe
		if (!pedido) {
			// Responder con error 404 si no se encuentra
			return res
				.status(404)
				.json({ status: "error", message: "Pedido no encontrado" });
		}
		// Responder con exito y el pedido eliminado
		res.status(200).json({ status: "success", data: pedido });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

const checkout = async (req, res) => {
	try {
		const userId = req.user.id;
		const pedido = await pedidoServicio.checkout(userId, req.body);

		if (!userId) {
			return res.status(401).json({
				ok: false,
				message: "Token sin id de usuario",
			});
		}

		return res.status(201).json({
			ok: true,
			orderId: pedido._id,
			total: pedido.total,
			estado: pedido.estado,
		});
	} catch (error) {
		console.error("Error en checkout:", error);
		return res.status(400).json({
			ok: false,
			message: error.message || "Error en el checkout",
		});
	}
};
module.exports = {
	crearPedido,
	obtenerPedidos,
	actualizarPedido,
	eliminarPedido,
	checkout,
};
