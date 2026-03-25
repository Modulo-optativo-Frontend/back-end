// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");
const { buildId } = require("../data/seedProductos");

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
	Middleware pre-save para generar automáticamente un identificador legible
	y único derivado de las especificaciones del producto.
	Ejemplo: modelo "Air", anio 2020, chip "M1", RAM 8, almacenamiento 256,
	condicion "A" -> "AIR2020M1080256A".
*/

esquemaProducto.pre("save", function (next) {
	const producto = this;

	// Comprobar si se debe generar o actualizar el ID alfanumérico
	const idNoExiste = !producto.idAlfaNumerico;
	const modeloModificado = producto.isModified("modelo");
	const anioModificado = producto.isModified("anio");
	const chipModificado = producto.isModified("chip");
	const ramModificada = producto.isModified("memoriaRamGb");
	const almacenamientoModificado = producto.isModified("almacenamientoGb");
	const condicionModificada = producto.isModified("condicion");

	if (
		idNoExiste ||
		modeloModificado ||
		anioModificado ||
		chipModificado ||
		ramModificada ||
		almacenamientoModificado ||
		condicionModificada
	) {
		producto.idAlfaNumerico = buildId(producto);
	}

	next();
});

// Crear modelo Producto a partir del esquema
const Producto = mongoose.model("Producto", esquemaProducto);

// Exportar el modelo para usarlo en otros archivos
module.exports = Producto;
