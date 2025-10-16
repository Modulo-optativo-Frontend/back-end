// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");

// Crear esquema de producto con sus propiedades y validaciones
const productoSchema = new mongoose.Schema({
	// SKU único y obligatorio
	sku: { type: String, required: true, unique: true },
	// Nombre del producto obligatorio
	name: { type: String, required: true },
	// Precio obligatorio y mayor que 0
	price: { type: Number, required: true, min: 0 },
	// Descripción opcional
	description: { type: String },
	// Estado de stock con valor por defecto true
	inStock: { type: Boolean, default: true },
	// Modelo obligatorio sin espacios extra
	model: { type: String, required: true, trim: true },
	// Año entre 2015 y 2025
	year: { type: Number, min: 2015, max: 2025 },
	// Chip sin espacios extra
	chip: { type: String, trim: true },
	// RAM solo con valores específicos
	ramGB: { type: Number, enum: [8, 16, 32, 64] },
	// Almacenamiento solo con valores específicos
	storageGB: { type: Number, enum: [128, 256, 512, 1024, 2048] },
	// Condición del producto con valor por defecto "A"
	condition: { type: String, enum: ["A", "B", "C"], default: "A" },
	// Array de URLs de imágenes
	images: [{ type: String }],
});

// Crear índice compuesto para búsquedas por modelo y año
productoSchema.index({ model: 1, year: -1 });
// Crear índice compuesto para búsquedas por chip y año
productoSchema.index({ chip: 1, year: -1 });

// Crear modelo Producto a partir del esquema
const Producto = mongoose.model("Producto", productoSchema);
// Exportar el modelo para usarlo en otros archivos
module.exports = Producto;
