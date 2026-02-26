const mongoose = require("mongoose");

const pedidoItemSchema = new mongoose.Schema(
	{
		producto: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Producto",
			required: true,
		},
		cantidad: {
			type: Number,
			required: true,
			min: 1,
		},
	
		precioUnitario: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{ _id: false }
);

const pedidoSchema = new mongoose.Schema(
	{
		usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", 
			required: true,
		},

		items: {
			type: [pedidoItemSchema],
			required: true,
			validate: {
				validator: (arr) => Array.isArray(arr) && arr.length > 0,
				message: "El pedido debe tener al menos un producto.",
			},
		},

		total: {
			type: Number,
			required: true,
			min: 0,
		},

		estado: {
			type: String,
			enum: ["pendiente", "procesando", "completado", "cancelado"],
			default: "pendiente",
		},

		fecha: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;