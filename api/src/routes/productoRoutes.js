const express = require("express");
const router = express.Router();
const productController = require("../controladores/controladorProducto");
const auth = require("../middleware/auth.js");
const roles = require("../middleware/roleMiddle.js");

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoBody'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos del producto invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Busqueda por texto libre en nombre, descripcion, modelo o chip
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *         description: Filtro exacto por modelo
 *       - in: query
 *         name: chip
 *         schema:
 *           type: string
 *         description: Filtro exacto por chip
 *       - in: query
 *         name: condicion
 *         schema:
 *           type: string
 *           enum: [A, B, C]
 *       - in: query
 *         name: enStock
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrecio
 *         schema:
 *           type: number
 *       - in: query
 *         name: orden
 *         schema:
 *           type: string
 *           enum: [precioAsc, 
 * 					precioDesc, 
 * 					anioAsc, anioDesc, 
 * 					nombreAsc, 	
 * 					nombreDesc]
 *         description: Ordenacion disponible
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 *
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ObjectId o identificador legible
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB o identificador alfanumerico unico del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un producto por ObjectId o identificador legible
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB o identificador alfanumerico unico del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoPatchBody'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB o identificador alfanumerico unico del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       401:
 *         description: Token requerido o invalido
 *       403:
 *         description: Acceso prohibido
 *       404:
 *         description: Producto no encontrado
 */
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
