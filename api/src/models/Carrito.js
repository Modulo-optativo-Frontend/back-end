const mongoose = require("mongoose");

const carritoItemSchema = new mongoose.Schema(
	{
		producto: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Producto",
			required: true,
		},
		cantidad: { type: Number, default: 1, min: 1 },
	},
	{ _id: false }
);

const carritoSchema = new mongoose.Schema(
	{
		usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Usuario",
			required: true,
			unique: true,
		},
		items: { type: [carritoItemSchema], default: [] },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Carrito", carritoSchema);
