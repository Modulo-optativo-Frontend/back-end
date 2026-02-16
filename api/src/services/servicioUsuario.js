// Importar el modelo Usuario
const Usuario = require("../models/Usuario.js");
const jwt = require("jsonwebtoken");
const process = require("process");
const bcrypt = require("bcrypt");

function crearError(mensaje, statusCode) {
	const error = new Error(mensaje);
	error.statusCode = statusCode;
	return error;
}

/**
 * Servicio CRUD - Crear un nuevo usuario en la base de datos
 * RECIBE: Objeto usuarioData con los datos del usuario
 * ENVÍA: Usuario guardado con contraseña hasheada automáticamente
 */
// Servicio para crear un nuevo usuario
const crearUsuario = async (usuarioData) => {
	const nuevoUsuario = new Usuario(usuarioData);
	return await nuevoUsuario.save();
};

/**
 * Servicio CRUD - Obtener todos los usuarios de la base de datos
 * RECIBE: No recibe parámetros
 * ENVÍA: Array con todos los usuarios encontrados
 */
// Servicio para obtener todos los usuarios
const obtenerUsuarios = async () => {
	return await Usuario.find();
};

/**
 * Servicio CRUD - Actualizar un usuario existente por su ID
 * RECIBE: ID del usuario y objeto usuarioData con datos a actualizar
 * ENVÍA: Usuario actualizado o null si no existe
 */
// Servicio para actualizar un usuario por ID
const actualizarUsuario = async (id, usuarioData) => {
	return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
};

/**
 * Servicio CRUD - Eliminar un usuario por su ID
 * RECIBE: ID del usuario a eliminar
 * ENVÍA: Usuario eliminado o null si no existe
 */
// Servicio para eliminar un usuario por ID
const eliminarUsuario = async (id) => {
	return await Usuario.findByIdAndDelete(id);
};

/**
 * Servicio AUTH - Registrar nuevo usuario con validación y token JWT
 * RECIBE: Objeto usuarioData con name, email, password
 * ENVÍA: Objeto con usuario sin contraseña y token JWT firmado
 */
const registrarUsuario = async (usuarioData) => {
	// 1) Desestructura datos: name, email, password
	const { name, email, password } = usuarioData;

	// 2) Buscar duplicado por email
	const existe = await Usuario.findOne({ email });

	//si existe -> lanzar un error de "duplicado" (controller)
	if (existe) {
		throw crearError("Usuario existe ya", 409);
	}

	// 3) Crear el usuario (el hook del modelo ya hará el hash)
	const nuevoUsuario = await Usuario.create({ name, email, password });

	return generarAuth(nuevoUsuario);
};

/**
 * Servicio AUTH - Iniciar sesión validando credenciales
 * RECIBE: Objeto usuarioData con email y password
 * ENVÍA: Objeto con usuario sin contraseña y token JWT si las credenciales son válidas
 */
const login = async (usuarioData) => {
	const { email, password } = usuarioData;

	const usuarioEncontrado = await Usuario.findOne({ email });

	if (!usuarioEncontrado) {
		throw crearError("Usuario no encontrado", 404);
	}

	const match = await bcrypt.compare(password, usuarioEncontrado.password);

	if (!match) {
		throw crearError("Credenciales inválidas", 401);
	}

	return generarAuth(usuarioEncontrado);
};

/**
 * Función auxiliar - Genera respuesta de autenticación con JWT
 * RECIBE: Objeto usuario de MongoDB
 * ENVÍA: Objeto con usuario limpio (sin password) y token JWT firmado
 */
async function generarAuth(usuarioEntrado) {
	const payload = {
		id: usuarioEntrado._id,
		email: usuarioEntrado.email,
		role: usuarioEntrado.role,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
	});

	usuarioEntrado.refreshToken = refreshToken;

	await usuarioEntrado.save();

	const usuario = {
		id: usuarioEntrado._id,
		name: usuarioEntrado.name,
		email: usuarioEntrado.email,
		role: usuarioEntrado.role,
		createdAt: usuarioEntrado.createdAt,
	};

	return { usuario, token, refreshToken };
}

const renovarToken = async (refreshToken) => {
	if (!refreshToken) {
		const error = new Error("Refresh token requerido");

		error.statusCode = 400;
		throw error;
	}
	let payload;
	try {
		payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	} catch (errorJwt) {
		const error = new Error("Refresh token inválido o caducado");
		error.statusCode = 401;
		throw error;
	}

	const usuarioId = payload.id;

	const usuario = await Usuario.findById(usuarioId);

	if (!usuario) {
		const error = new Error("Usuario no encontrado");
		error.statusCode = 404;
		throw error;
	}

	if (usuario.refreshToken !== refreshToken) {
		usuario.token = null;
		await usuario.save();

		const error = new Error("Los tokens no coinciden");
		error.statusCode = 401;
		throw error;
	}

	const resultado = await generarAuth(usuario);
	return resultado;
};

// Exportar todos los servicios
module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
	registrarUsuario,
	login,
	renovarToken,
};
