// Importar el modelo Usuario
const Usuario = require("../models/Usuario.js");

// Servicio para crear un nuevo usuario
const crearUsuario = async (usuarioData) => {
	
	// Crear nueva instancia del Usuario con los datos recibidos
	const nuevoUsuario = new Usuario(usuarioData);
	// Guardar el Usuario en la base de datos y retornarlo
	return await nuevoUsuario.save();
};

// Servicio para obtener todos los usuarios
const obtenerUsuarios = async () => {
	// Buscar y retornar todos los usuarios de la base de datos
	return await Usuario.find();
};

// Servicio para actualizar un usuario por ID
const actualizarUsuario = async (id, data) => {
	// Buscar usuario por ID, actualizarlo y retornar la versión actualizada
	return await Usuario.findByIdAndUpdate(id, data, { new: true });
};

// Servicio para eliminar un usuario por ID
const eliminarUsuario = async (id) => {
	// Buscar usuario por ID, eliminarlo y retornarlo
	return await Usuario.findByIdAndDelete(id);
};

// Exportar todos los servicios
module.exports = {
	crearUsuario,
	obtenerUsuarios,
	actualizarUsuario,
	eliminarUsuario,
};
