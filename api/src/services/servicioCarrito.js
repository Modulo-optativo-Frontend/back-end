const Carrito = require("../models/Carrito");

async function getCarritoByUserId(usuarioId) {
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
