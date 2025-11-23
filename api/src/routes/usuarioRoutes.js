const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/controladorUsuario.js");
const auth = require("../middlewares/auth.js");

// === RUTAS CRUD BÁSICAS ===
// POST / - Crear usuario (datos en body)
// GET / - Obtener todos los usuarios
// PUT /:id - Actualizar usuario por ID (datos en body)
// DELETE /:id - Eliminar usuario por ID

//Crud completo
router.post("/", auth, usuarioController.crearUsuario);
router.get("/", auth, usuarioController.obtenerUsuarios);
router.put("/:id", auth, usuarioController.actualizarUsuario);
router.delete("/:id", auth, usuarioController.eliminarUsuario);

// === RUTAS DE AUTENTICACIÓN ===
// POST /registrar - Registrar nuevo usuario (name, email, password en body) → devuelve token
// POST /login - Iniciar sesión (email, password en body) → devuelve usuario y token

//usuario
router.post("/registrar", usuarioController.registrarUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/refresh", usuarioController.refresh);

//Exports
module.exports = router;
