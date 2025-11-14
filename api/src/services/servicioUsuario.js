// Importar el modelo Usuario
const Usuario = require("../models/Usuario.js");
const jwt = require("jsonwebtoken");
const process = require("process");
const bcrypt = require('bcrypt');

// Servicio para crear un nuevo usuario
const crearUsuario = async (usuarioData) => {
	const nuevoUsuario = new Usuario(usuarioData);
	return await nuevoUsuario.save();
};

// Servicio para obtener todos los usuarios
const obtenerUsuarios = async () => {
	return await Usuario.find();
};

// Servicio para actualizar un usuario por ID
const actualizarUsuario = async (id, usuarioData) => {
	return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
};

// Servicio para eliminar un usuario por ID
const eliminarUsuario = async (id) => {
	return await Usuario.findByIdAndDelete(id);
};

const registrarUsuario = async (usuarioData) => {
	// 1) Desestructura datos: name, email, password
	const { name, email, password } = usuarioData;

	// 2) Buscar duplicado por email
	const existe = await Usuario.findOne({ email });

	//si existe -> lanzar un error de "duplicado" (controller)
	if (existe) {
		throw new Error("Usuario existe ya");
	}

	// 3) Crear el usuario (el hook del modelo ya hará el hash)
	const nuevoUsuario = await Usuario.create({ name, email, password });

	return generarAuth(nuevoUsuario);
};

const login = async (usuarioData) => {
	const { email, password } = usuarioData;

	const usuarioEncontrado = await Usuario.findOne({ email });

	if (!usuarioEncontrado) {
		throw new Error("Usuario no encontrado");
	}

	const match = await bcrypt.compare(password, usuarioEncontrado.password);

	if (!match) {
		throw new Error("no hay correo");
	}

	return generarAuth(usuarioEncontrado);
};

function generarAuth(usuarioEntrado) {
	// 1) Construir payload del token: { id:_id, email, role }
	const payload = {
		id: usuarioEntrado._id,
		email: usuarioEntrado.email,
		role: usuarioEntrado.role,
	};

	// 2) Firmar el token con JWT_SECRET y expiresIn
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	// 3) Construir usuario público (sin password): { id, name, email, role, createdAt }
	const usuario = {
		id: usuarioEntrado._id,
		name: usuarioEntrado.name,
		email: usuarioEntrado.email,
		role: usuarioEntrado.role,
		createdAt: usuarioEntrado.createdAt,
	};

	// 4) return { usuarioSinPassword, token }
	return { usuario, token };
}

// Exportar todos los servicios
module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
	registrarUsuario,
	login,
};
