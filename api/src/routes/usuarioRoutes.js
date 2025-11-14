const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/controladorUsuario.js");

//Crud completo
router.post("/", usuarioController.crearUsuario);
router.get("/", usuarioController.obtenerUsuarios);
router.put("/:id", usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

//usuario
router.post("/registrar", usuarioController.registrarUsuario);
router.post("/login", usuarioController.loginUsuario);



//Exports
module.exports = router;
