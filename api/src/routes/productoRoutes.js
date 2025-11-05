const express = require("express");
const router = express.Router();
const productController = require("../controladores/controladorProducto");

// CRUD completo
router.post("/", productController.crearProducto);
router.get("/", productController.obtenerProductos);
router.get("/:id", productController.obtenerProductoPorId);
router.put("/:id", productController.actualizarProducto);
router.delete("/:id", productController.eliminarProducto);

module.exports = router;
