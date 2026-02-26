const express = require("express");
const router = express.Router();
const pedidoController = require("../controladores/controladorPedido.js");
const auth = require("../middleware/auth.js");


// Rutas para gestionar pedidos
router.post("/", pedidoController.crearPedido);
router.post("/checkout", auth.auth, pedidoController.checkout);
router.get("/", pedidoController.obtenerPedidos);
router.put("/:id", pedidoController.actualizarPedido);
router.delete("/:id", pedidoController.eliminarPedido);

module.exports = router;
