const express = require("express");
const router = express.Router();
const productController = require("../controladores/controladorProducto");
const auth = require("../middleware/auth.js");
const roles = require("../middleware/roleMiddle.js");
// CRUD completo
router.post("/", productController.crearProducto);
router.get("/", productController.obtenerProductos);
router.get("/:id", productController.obtenerProductoPorId);
router.put("/:id", productController.actualizarProducto);
router.delete(
	"/:id",
	auth.auth,
	roles.soloAdmin,
	productController.eliminarProducto,
);

module.exports = router;
