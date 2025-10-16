// Importar mongoose para crear esquemas y modelos
const mongoose = require("mongoose");

// Crear esquema de usuario con timestamps automáticos
const userSchema = new mongoose.Schema(
	{
		// Nombre mínimo 2 caracteres y obligatorio
		name: { type: String, required: true, minlength: 2 },
		// Email único, obligatorio y con formato válido
		email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
		// Contraseña mínimo 8 caracteres y obligatoria
		password: { type: String, required: true, minlength: 8 },
		// Rol del usuario con valor por defecto "customer"
		role: { type: String, enum: ["admin", "customer"], default: "customer" },
	},
	// Añadir campos createdAt y updatedAt automáticamente
	{ timestamps: true }
);

// Crear índice compuesto por rol y fecha de creación
userSchema.index({ role: 1, createdAt: -1 });
// Crear índice simple por rol
userSchema.index({ role: 1 });
// Crear índice simple por fecha de creación
userSchema.index({ createdAt: -1 });
// Crear índice compuesto por rol y fecha de creación (duplicado)
userSchema.index({ role: 1, createdAt: -1 });

// Crear modelo User a partir del esquema
const User = mongoose.model("User", userSchema);
// Exportar el modelo para usarlo en otros archivos
module.exports = User;
