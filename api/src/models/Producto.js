const mongoose = require("mongoose");
const productoSchema = new mongoose.Schema({
	sku: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
	description: { type: String },
	inStock: { type: Boolean, default: true },
	model: { type: String, required: true, trim: true },
	year: { type: Number, min: 2015, max: 2025 },
	chip: { type: String, trim: true },
	ramGB: { type: Number, enum: [8, 16, 32, 64] },
	storageGB: { type: Number, enum: [128, 256, 512, 1024, 2048] },
	condition: { type: String, enum: ["A", "B", "C"], default: "A" },
	images: [{ type: String }],
});

productoSchema.index({ model: 1, year: -1 });
productoSchema.index({ chip: 1, year: -1 });

const Producto = mongoose.model("Producto", productoSchema)