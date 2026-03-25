const express = require("express");
const router = express.Router();
const pedidoController = require("../controladores/controladorPedido.js");
const auth = require("../middleware/auth.js");

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido manualmente
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoBody'
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Pedido creado exitosamente
 *       400:
 *         description: Datos del pedido invalidos
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
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
 *                     $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Error interno del servidor
 *
 * /api/pedidos/checkout:
 *   post:
 *     summary: Crear un pedido a partir del carrito autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Checkout completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 orderId:
 *                   type: string
 *                   example: 67f1234567890abcdef9999
 *                 total:
 *                   type: number
 *                   example: 799
 *                 estado:
 *                   type: string
 *                   example: pendiente
 *       400:
 *         description: Carrito vacio o checkout invalido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Carrito no encontrado
 *       409:
 *         description: Producto ya vendido o inexistente
 *
 * /api/pedidos/mis-pedidos:
 *   get:
 *     summary: Obtener los pedidos del usuario autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedidos del usuario autenticado
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
 *                     $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 *
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoPatchBody'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Pedido no encontrado
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error eliminando pedido
 *       404:
 *         description: Pedido no encontrado
 */

// Rutas para gestionar pedidos
router.post("/", pedidoController.crearPedido);
router.post("/checkout", auth.auth, pedidoController.checkout);

router.get("/", pedidoController.obtenerPedidos);
router.get("/mis-pedidos", auth.auth, pedidoController.obtenerMisPedidos);

router.put("/:id", pedidoController.actualizarPedido);

router.delete("/:id", pedidoController.eliminarPedido);

module.exports = router;
