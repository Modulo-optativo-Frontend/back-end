const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");
const mongoose = require("mongoose");

function crearError(mensaje, statusCode) {
	const error = new Error(mensaje);
	error.statusCode = statusCode;
	return error;
}

async function getCarritoByUserId(usuarioId) {
	if (!usuarioId) {
		throw crearError("Usuario no autenticado", 401);
	}

	if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
		throw crearError("Usuario inválido", 400);
	}

	let carrito = await Carrito.findOne({
		usuario: usuarioId,
	}).populate("items.producto");

	if (!carrito) {
		carrito = await Carrito.create({ usuario: usuarioId, items: [] });
		carrito = await carrito.populate("items.producto");
	}

	return carrito;
}

async function addItem(usuarioId, productoId) {
	if (!productoId) {
		throw crearError("productoId requerido", 400);
	}

	if (!mongoose.Types.ObjectId.isValid(productoId)) {
		throw crearError("productoId inválido", 400);
	}

	const productoExiste = await Producto.findById(productoId);
	if (!productoExiste) {
		throw crearError("Producto no encontrado", 404);
	}

	const carrito = await getCarritoByUserId(usuarioId);

	const idx = carrito.items.findIndex(
		(it) =>
			String(it.producto?._id || it.producto) === String(productoId),
	);

	if (idx >= 0) carrito.items[idx].cantidad += 1;
	else carrito.items.push({ producto: productoId, cantidad: 1 });

	await carrito.save();
	return await carrito.populate("items.producto");
}

async function removeItem(usuarioId, productoId) {
	if (!productoId) {
		throw crearError("productoId requerido", 400);
	}

	if (!mongoose.Types.ObjectId.isValid(productoId)) {
		throw crearError("productoId inválido", 400);
	}

	const carrito = await getCarritoByUserId(usuarioId);

	const idx = carrito.items.findIndex(
		(it) =>
			String(it.producto?._id || it.producto) === String(productoId),
	);

	if (idx === -1) return await carrito.populate("items.producto");

	carrito.items[idx].cantidad -= 1;
	if (carrito.items[idx].cantidad <= 0) carrito.items.splice(idx, 1);

	await carrito.save();
	return await carrito.populate("items.producto");
}

async function clearCarrito(usuarioId) {
	const carrito = await getCarritoByUserId(usuarioId);
	carrito.items = [];
	await carrito.save();
	return await carrito.populate("items.producto");
}

module.exports = {
	getCarritoByUserId,
	addItem,
	removeItem,
	clearCarrito,
};
