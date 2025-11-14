const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const process = require("process");

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
	{ timestamps: true }
);

// userSchema.methods.compararPassword = async function (passwordCandidata) {
// 	const match = await bcrypt.compare(passwordCandidata, this.password);
// 	return match;
// };


//Funciones antes de guardar
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const saltRounds = Number(process.env.HASH_NUMBER) || 10;
	const salt = await bcrypt.genSalt(saltRounds);
	this.password = await bcrypt.hash(this.password, salt);
	return next();
});

// Indices
userSchema.index({ role: 1, createdAt: -1 });

userSchema.index({ role: 1 });

userSchema.index({ createdAt: -1 });

// Crear modelo User a partir del esquema
const User = mongoose.model("User", userSchema);

// Exportar el modelo para usarlo en otros archivos
module.exports = User;
