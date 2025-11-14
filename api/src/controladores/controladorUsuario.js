const usuarioServicio = require("../services/servicioUsuario");

/**
 * Controlador CRUD - Crear un nuevo usuario
 * RECIBE: Datos del usuario desde req.body (name, email, password, role opcional)
 * ENVÍA: Mensaje de confirmación al cliente con status 201
 */
// Controlador para crear un nuevo usuario
const crearUsuario = async (req, res) => {
	try {
		// Llamar al servicio para crear el usuario con los datos del body
		await usuarioServicio.crearUsuario(req.body);
		// Responder con éxito
		res
			.status(201)
			.json({ status: "success", message: "Usuario creado exitosamente" });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Obtener todos los usuarios
 * RECIBE: Petición GET sin parámetros
 * ENVÍA: Array con todos los usuarios de la base de datos al cliente
 */
// Controlador para obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
	try {
		// Llamar al servicio para obtener todos los usuarios
		const usuarios = await usuarioServicio.obtenerUsuarios();
		// Responder con éxito y la lista de usuarios
		res.status(200).json({ status: "success", data: usuarios });
	} catch (error) {
		// Responder con error del servidor si algo falla
		res.status(500).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Actualizar un usuario existente
 * RECIBE: ID del usuario desde req.params.id y datos a actualizar desde req.body
 * ENVÍA: Usuario actualizado al cliente o error 404 si no existe
 */
// Controlador para actualizar un usuario
const actualizarUsuario = async (req, res) => {
	try {
		// Llamar al servicio para actualizar el usuario por ID
		const usuario = await usuarioServicio.actualizarUsuario(
			req.params.id,
			req.body
		);
		// Verificar si el usuario existe
		if (!usuario) {
			// Responder con error 404 si no se encuentra
			return res
				.status(404)
				.json({ status: "error", message: "Usuario no encontrado" });
		}
		// Responder con éxito y el usuario actualizado
		res.status(200).json({ status: "success", data: usuario });
	} catch (error) {
		// Responder con error si algo falla
		res.status(400).json({ status: "error", message: error.message });
	}
};

/**
 * Controlador CRUD - Eliminar un usuario
 * RECIBE: ID del usuario desde req.params.id
 * ENVÍA: Usuario eliminado al cliente o error 404 si no existe
 */
// Controlador para eliminar un usuario
const eliminarUsuario = async (req, res) => {
	try {
		const usuario = await usuarioServicio.eliminarUsuario(req.params.id);
		if (!usuario) {
			return res.status(404).json({
				status: "error",
				message: "No se ha podido eliminar el usuario",
			});
		}
		// Responder con éxito y el usuario eliminado
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
//funciones que hace el user
const registrarUsuario = async (req, res) => {
	try {
		const resultado = await usuarioServicio.registrarUsuario(req.body);

		const nombre = resultado.usuario.name;
		const token = resultado.token;

		res.status(201).json({ status: "success", data: { nombre, token } });
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
		const { usuario, token } = await usuarioServicio.login(req.body);

		res.status(200).json({ status: "Success", data: { usuario, token } });
	} catch (error) {
		if (error.name === "ValidationError") {
			res.status(400).json({ status: "Error", message: error.message });
			return;
		}

		res.status(500).json({ status: "Error", message: error.message });
	}
};

module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
	registrarUsuario,
	loginUsuario,
};
