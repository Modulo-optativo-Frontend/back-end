const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const carritoController = require("../controladores/controladorCarrito");

/**
 * @swagger
 * /api/carrito:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarritoItem'
 *       400:
 *         description: Usuario invalido
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error obteniendo carrito
 *   delete:
 *     summary: Vaciar el carrito del usuario autenticado
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   example: []
 *                   items:
 *                     $ref: '#/components/schemas/CarritoItem'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error vaciando carrito
 *
 * /api/carrito/items:
 *   post:
 *     summary: Agregar una unidad de producto al carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId]
 *             properties:
 *               productoId:
 *                 type: string
 *                 example: 67f1234567890abcdef5678
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarritoItem'
 *       400:
 *         description: productoId requerido o invalido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Producto no encontrado
 *
 * /api/carrito/items/{productoId}:
 *   delete:
 *     summary: Quitar una unidad de producto del carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarritoItem'
 *       400:
 *         description: productoId invalido
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error quitando item
 */

// GET /api/carrito
router.get("/", auth, carritoController.obtenerCarrito);

// POST /api/carrito/items
router.post("/items", auth, carritoController.agregarItem);

// DELETE /api/carrito/items/:productoId
router.delete("/items/:productoId", auth, carritoController.quitarItem);

// DELETE /api/carrito (vaciar)
router.delete("/", auth, carritoController.vaciarCarrito);

module.exports = router;
