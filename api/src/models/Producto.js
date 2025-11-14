// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");

// Crear esquema de producto con sus propiedades y validaciones
const esquemaProducto = new mongoose.Schema({
	// ID alfanumérico único
	idAlfaNumerico: { type: String, required: true, unique: true },
	// SKU único y obligatorio
	codigoSku: { type: String, required: true, unique: true },
	// Nombre del producto obligatorio
	nombre: { type: String, required: true },
	// Precio obligatorio y mayor que 0
	precio: { type: Number, required: true, min: 0 },
	// Descripción opcional
	descripcion: { type: String },
	// Estado de stock con valor por defecto true
	enStock: { type: Boolean, default: true },
	// Modelo obligatorio sin espacios extra
	modelo: { type: String, required: true, trim: true },
	// Año entre 2015 y 2025
	anio: { type: Number, min: 2015, max: 2025 },
	// Chip sin espacios extra
	chip: { type: String, trim: true },
	// RAM solo con valores específicos
	memoriaRamGb: { type: Number, enum: [8, 16, 32, 64] },
	// Almacenamiento solo con valores específicos
	almacenamientoGb: { type: Number, enum: [128, 256, 512, 1024, 2048] },
	// Condición del producto con valor por defecto "A"
	condicion: { type: String, enum: ["A", "B", "C"], default: "A" },
	// Array de URLs de imágenes
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
		// Obtener las tres primeras letras del nombre en mayúsculas
		const nombreEnMayusculas = producto.nombre.substring(0, 3).toUpperCase();

		// Convertir el año a cadena o usar valor por defecto
		const anioComoTexto = producto.anio ? producto.anio.toString() : "0000";

		// Generar el ID final concatenando nombre y año
		const idGenerado = `${nombreEnMayusculas}${anioComoTexto}`;

		// Asignar el ID generado al campo del documento
		producto.idAlfaNumerico = idGenerado;
	}

	next();
});

// Crear modelo Producto a partir del esquema
const Producto = mongoose.model("Producto", esquemaProducto);

// Exportar el modelo para usarlo en otros archivos
module.exports = Producto;
