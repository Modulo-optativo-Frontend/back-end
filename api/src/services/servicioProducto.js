const mongoose = require("mongoose");
const Producto = require("../models/Producto.js");

function escaparTextoParaRegex(texto) {
	return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function convertirEnBooleano(valor) {
	if (valor === true || valor === "true") return true;
	if (valor === false || valor === "false") return false;
	return undefined;
}

function construirOrden(ordenSolicitado) {
	const ordenesDisponibles = {
		precioAsc: { precio: 1 },
		precioDesc: { precio: -1 },
		anioAsc: { anio: 1 },
		anioDesc: { anio: -1 },
		nombreAsc: { nombre: 1 },
		nombreDesc: { nombre: -1 },
	};

	return ordenesDisponibles[ordenSolicitado] || { _id: -1 };
}

async function buscarProductoPorIdentificador(identificador) {
	// Si parece ObjectId, intentamos primero por _id.
	if (mongoose.Types.ObjectId.isValid(identificador)) {
		const productoPorMongoId = await Producto.findById(identificador);
		if (productoPorMongoId) return productoPorMongoId;
	}

	// Si no se encuentra por _id, probamos por idAlfaNumerico.
	return Producto.findOne({ idAlfaNumerico: identificador });
}

const crearProducto = async (datosProducto) => {
	const productoNuevo = new Producto(datosProducto);
	return productoNuevo.save();
};

const obtenerProductos = async (filtros = {}) => {
	const {
		q,
		modelo,
		chip,
		condicion,
		enStock,
		minPrecio,
		maxPrecio,
		orden,
	} = filtros;

	const consulta = {};

	const textoBusqueda = typeof q === "string" ? q.trim() : "";
	if (textoBusqueda) {
		const textoSeguro = escaparTextoParaRegex(textoBusqueda);
		consulta.$or = [
			{ nombre: { $regex: textoSeguro, $options: "i" } },
			{ descripcion: { $regex: textoSeguro, $options: "i" } },
			{ modelo: { $regex: textoSeguro, $options: "i" } },
			{ chip: { $regex: textoSeguro, $options: "i" } },
		];
	}

	if (modelo) consulta.modelo = modelo;
	if (chip) consulta.chip = chip;
	if (condicion) consulta.condicion = condicion;

	const filtroStock = convertirEnBooleano(enStock);
	if (typeof filtroStock === "boolean") {
		consulta.enStock = filtroStock;
	}

	const precioMinimo = Number(minPrecio);
	const precioMaximo = Number(maxPrecio);
	const hayMinimo = Number.isFinite(precioMinimo);
	const hayMaximo = Number.isFinite(precioMaximo);

	if (hayMinimo || hayMaximo) {
		consulta.precio = {};
		if (hayMinimo) consulta.precio.$gte = precioMinimo;
		if (hayMaximo) consulta.precio.$lte = precioMaximo;
	}

	const ordenFinal = construirOrden(orden);
	return Producto.find(consulta).sort(ordenFinal);
};

const obtenerProductoPorId = async (id) => {
	return buscarProductoPorIdentificador(id);
};

const actualizarProducto = async (id, datosActualizados) => {
	if (mongoose.Types.ObjectId.isValid(id)) {
		return Producto.findByIdAndUpdate(id, datosActualizados, {
			new: true,
			runValidators: true,
		});
	}

	return Producto.findOneAndUpdate(
		{ idAlfaNumerico: id },
		datosActualizados,
		{ new: true, runValidators: true }
	);
};

const eliminarProducto = async (id) => {
	if (mongoose.Types.ObjectId.isValid(id)) {
		return Producto.findByIdAndDelete(id);
	}

	return Producto.findOneAndDelete({ idAlfaNumerico: id });
};

module.exports = {
	crearProducto,
	obtenerProductos,
	actualizarProducto,
	eliminarProducto,
	obtenerProductoPorId,
};
