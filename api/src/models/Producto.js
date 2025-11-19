// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");

// Crear esquema de producto con sus propiedades y validaciones
const esquemaProducto = new mongoose.Schema({
	idAlfaNumerico: { type: String, required: true, unique: true },
	codigoSku: { type: String, required: true, unique: true },
	nombre: { type: String, required: true },
	precio: { type: Number, required: true, min: 0 },
	descripcion: { type: String },
	enStock: { type: Boolean, default: true },
	modelo: { type: String, required: true, trim: true },
	anio: { type: Number, min: 2015, max: 2025 },
	chip: { type: String, trim: true },
	memoriaRamGb: { type: Number, enum: [8, 16, 32, 64] },
	almacenamientoGb: { type: Number, enum: [128, 256, 512, 1024, 2048] },
	condicion: { type: String, enum: ["A", "B", "C"], default: "A" },
	imagenes: [{ type: String }],
});

// Crear índice compuesto para búsquedas por modelo y año
esquemaProducto.index({ modelo: 1, anio: -1 });
// Crear índice compuesto para búsquedas por chip y año
esquemaProducto.index({ chip: 1, anio: -1 });

/*
	Middleware pre-save para generar automáticamente un ID alfanumérico.
	Este ID se compone por las tres primeras letras del nombre (en mayúsculas)
	y el año del producto. Ejemplo: "MacBook", 2021 -> "MAC2021".
*/

esquemaProducto.pre("save", function (next) {
	const producto = this;

	// Comprobar si se debe generar o actualizar el ID alfanumérico
	const idNoExiste = !producto.idAlfaNumerico;
	const nombreModificado = producto.isModified("nombre");
	const anioModificado = producto.isModified("anio");

	if (idNoExiste || nombreModificado || anioModificado) {
		const nombreEnMayusculas = producto.nombre.substring(0, 3).toUpperCase();

		const anioComoTexto = producto.anio ? producto.anio.toString() : "0000";

		const idGenerado = `${nombreEnMayusculas}${anioComoTexto}`;

		producto.idAlfaNumerico = idGenerado;
	}

	next();
});

// Crear modelo Producto a partir del esquema
const Producto = mongoose.model("Producto", esquemaProducto);

// Exportar el modelo para usarlo en otros archivos
module.exports = Producto;
