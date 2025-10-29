// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");

// Crear esquema de producto con sus propiedades y validaciones
const productoSchema = new mongoose.Schema({
	// id
	idAlphaNum: { type: String, required: true, unique: true },
	// SKU único y obligatorio
	sku: { type: String, required: true, unique: true },
	// Nombre del producto objligatorio
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

/*
	Middleware pre-save para generar automáticamente un ID alfanumérico.
	Este ID se compone por las tres primeras letras del nombre (en mayúsculas)
	y el año del producto. Ejemplo: "MacBook", 2021 -> "MAC2021".
*/

productoSchema.pre("save", function (next) {
	const producto = this;

	// Comprobar si se debe generar o actualizar el ID alfanumérico
	const idNoExiste = !producto.idAlphaNum;
	const nombreModificado = producto.isModified("name");
	const anioModificado = producto.isModified("year");

	if (idNoExiste || nombreModificado || anioModificado) {
		// Obtener las tres primeras letras del nombre en mayúsculas
		const nombreEnMayusculas = producto.name.substring(0, 3).toUpperCase();

		// Convertir el año a cadena o usar valor por defecto
		const anioComoTexto = producto.year ? producto.year.toString() : "0000";

		// Generar el ID final concatenando nombre y año
		const idGenerado = `${nombreEnMayusculas}${anioComoTexto}`;

		// Asignar el ID generado al campo del documento
		producto.idAlphaNum = idGenerado;
	}

	next();
});

// Crear modelo Producto a partir del esquema
const Producto = mongoose.model("Producto", productoSchema);
// Exportar el modelo para usarlo en otros archivos
module.exports = Producto;
