const usuarioServicio = require("../services/servicioUsuario");

/**
 * Controlador CRUD - Crear un nuevo usuario
 * RECIBE: Datos del usuario desde req.body (name, email, password, role opcional)
 * ENVÍA: Mensaje de confirmación al cliente con status 201
 */
const crearUsuario = async (req, res) => {
	try {
		await usuarioServicio.crearUsuario(req.body);
		res
			.status(201)
			.json({ status: "success", message: "Usuario creado exitosamente" });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Obtener todos los usuarios
 * RECIBE: Petición GET sin parámetros
 * ENVÍA: Array con todos los usuarios de la base de datos al cliente
 */
const obtenerUsuarios = async (req, res) => {
	try {
		const usuarios = await usuarioServicio.obtenerUsuarios();
		res.status(200).json({ status: "success", data: usuarios });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Actualizar un usuario existente
 * RECIBE: ID del usuario desde req.params.id y datos a actualizar desde req.body
 * ENVÍA: Usuario actualizado al cliente o error 404 si no existe
 */
const actualizarUsuario = async (req, res) => {
	try {
		// Llamar al servicio para actualizar el usuario por ID
		const usuario = await usuarioServicio.actualizarUsuario(
			req.params.id,
			req.body
		);
		if (!usuario) {
			return res
				.status(404)
				.json({ status: "error", message: "Usuario no encontrado" });
		}
		res.status(200).json({ status: "success", data: usuario });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Eliminar un usuario
 * RECIBE: ID del usuario desde req.params.id
 * ENVÍA: Usuario eliminado al cliente o error 404 si no existe
 */
const eliminarUsuario = async (req, res) => {
	try {
		const usuario = await usuarioServicio.eliminarUsuario(req.params.id);
		if (!usuario) {
			return res.status(404).json({
				status: "error",
				message: "No se ha podido eliminar el usuario",
			});
		}
		res.status(200).json({ status: "success", data: usuario });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador AUTH - Registrar nuevo usuario con autenticación
 * RECIBE: Datos del usuario desde req.body (name, email, password)
 * ENVÍA: Nombre del usuario y token JWT al cliente para autenticación
 */
const registrarUsuario = async (req, res) => {
	try {
		const resultado = await usuarioServicio.registrarUsuario(req.body);

		const nombre = resultado.usuario.name;
		const token = resultado.token;
		const refreshToken = resultado.refreshToken;

		res
			.status(201)
			.json({ status: "success", data: { nombre, token, refreshToken } });
	} catch (error) {
		if (error.code === 11000) {
			res.status(409).json({ status: "Error", message: error.message });
			return;
		}

		if (error.name === "ValidationError") {
			res.status(400).json({ status: "error", message: error.message });
			return;
		}

		res.status(500).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador AUTH - Iniciar sesión de usuario
 * RECIBE: Credenciales desde req.body (email, password)
 * ENVÍA: Datos del usuario y token JWT al cliente si las credenciales son válidas
 */
const loginUsuario = async (req, res) => {
	try {
		const { usuario, token, refreshToken } = await usuarioServicio.login(
			req.body
		);

		res
			.status(200)
			.json({ status: "Success", data: { usuario, token, refreshToken } });
	} catch (error) {
		if (error.name === "ValidationError") {
			res.status(400).json({ status: "Error", message: error.message });
			return;
		}

		res
			.status(error.statusCode || 500)
			.json({ status: "Error", message: error.message });
	}
};

const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	if (!refreshToken) {
		return res
			.status(400)
			.json({ status: "Error", message: "refresh Token requerido" });
	}
	try {
		const resultado = await usuarioServicio.renovarToken(refreshToken);
		res.status(200).json({ status: "success", data: resultado });
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ status: "Error", message: error.message });
	}
};

module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
	registrarUsuario,
	loginUsuario,
	refresh,
};
