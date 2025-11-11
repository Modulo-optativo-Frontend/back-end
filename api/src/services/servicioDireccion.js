const Direccion = require("../models/Direccion.js");

const crearDireccion = async (direccionDatos) => {
	const nuevaDireccion = new Direccion(direccionDatos);
	return await nuevaDireccion.save();
};

const obtenerDireccion = async () => {
	return await Direccion.find();
};

const obtenerDireccionPorId = async (id) => {
	return await Direccion.findOne(id);
};

const actualizarDireccion = async (id, datos) => {
	return await Direccion.findByIdAndDelete(id, datos, { new: true });
};

const eliminarDireccion = async (id) => {
	return await Direccion.findByIdAndDelete(id);
};

module.exports = {
	crearDireccion,
	obtenerDireccion,
	obtenerDireccionPorId,
	actualizarDireccion,
	eliminarDireccion,
};
