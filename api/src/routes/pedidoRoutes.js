const express = require("express");
const router = express.Router();
const pedidoController = require("../controladores/controladorPedido.js");
const { model } = require("mongoose");


// Rutas para gestionar pedidos
router.post("/", pedidoController.crearPedido);
router.get("/", pedidoController.obtenerPedidos);
router.put("/:id", pedidoController.actualizarPedido);
router.delete("/:id", pedidoController.eliminarPedido);

module.exports = router;