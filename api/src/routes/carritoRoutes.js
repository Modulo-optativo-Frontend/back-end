const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth"); 
const carritoController = require("../controladores/controladorCarrito");

// GET /api/carrito
router.get("/", auth, carritoController.obtenerCarrito);

// POST /api/carrito/items
router.post("/items", auth, carritoController.agregarItem);

// DELETE /api/carrito/items/:productoId
router.delete("/items/:productoId", auth, carritoController.quitarItem);

// DELETE /api/carrito (vaciar)
router.delete("/", auth, carritoController.vaciarCarrito);

module.exports = router;
