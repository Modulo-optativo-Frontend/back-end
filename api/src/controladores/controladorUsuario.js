const usuarioServicio = require("../servicios/servicioUsuario");

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

// Controlador para eliminar un usuario
const eliminarUsuario = async (req, res) => {
	try {
		const usuario = await usuarioServicio.eliminarUsuario(req.params.id);
		if (!usuario) {
			res.status(404).json({
				status: "error",
				message: "No se ha podido eliminar el usuario",
			});
		}
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

//funciones que hace el user
const registrarUsuario = async (req, res) => {
	try {
		const resultado = await usuarioServicio.registrar(req.body);

		if (!resultado) {
			res.status(404).json({ status: "Error", message: "No hay resultado" });
			return;
		}

		const nombre = resultado.name;
		const token = resultado.token;

		res.status(201).json({ status: "success", data: { nombre, token } });
	} catch (error) {
		if (error.code === 1100) {
			res.status(400).json({ status: "Error", message: error.message });
			return;
		}

		if (error.name === "ValidationError") {
			res.status(400).json({ status: "error", message: error.message });
			return;
		}

		res.status(500).json({ status: "error", message: error.message });
	}
};

module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
	registrarUsuario,
};
