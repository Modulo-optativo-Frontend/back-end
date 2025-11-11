const mongoose = require("mongoose");

const direccionSchema = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	calle: { type: String, required: true },
	numeroCalle: { type: Number, required: true, min: 1 },
	ciudad: { type: String, required: true },
	codigoPostal: { type: Number, required: true, max: 5 },
	pais: { type: String, required: true },
});

const Direccion = mongoose.model("Direccion", direccionSchema);

module.exports = Direccion;
