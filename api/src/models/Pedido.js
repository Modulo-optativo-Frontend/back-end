const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
	id_pedido: { type: String, required: true, unique: true },
	total: { type: Number, required: true, min: 0 },
	estado: {
		type: String,
		enum: ["pendiente", "procesando", "completado", "cancelado"],
		default: "pendiente",
	},
	fecha: { type: Date, default: Date.now },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);
module.exports = Pedido;
