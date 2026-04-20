const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.SECRET_KEY);
const { auth } = require("../middleware/auth.js");
const pedidoServicio = require("../services/servicioPedido.js");
const Carrito = require("../models/Carrito.js");

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Integración con Stripe para procesar pagos
 */

/**
 * @swagger
 * /api/checkout/create-session:
 *   post:
 *     summary: Crear sesión de pago en Stripe
 *     description: |
 *       Lee el carrito del usuario autenticado, valida el stock de cada producto
 *       y crea una sesión de pago en Stripe. No modifica la base de datos.
 *       El pedido se crea únicamente cuando Stripe confirma el pago via webhook.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión de Stripe creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 sessionId:
 *                   type: string
 *                   example: cs_test_a1b2c3d4e5f6...
 *       400:
 *         description: El carrito está vacío
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Producto inexistente o sin stock
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create-session", auth, async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId)
			return res.status(401).json({ ok: false, message: "No autenticado" });

		// Leer carrito sin modificar nada
		const carrito = await Carrito.findOne({ usuario: userId }).populate(
			"items.producto",
		);

		if (!carrito || !carrito.items?.length)
			return res
				.status(400)
				.json({ ok: false, message: "El carrito está vacío" });

		// Validar stock antes de enviar a Stripe
		for (const item of carrito.items) {
			if (!item.producto)
				return res
					.status(409)
					.json({ ok: false, message: "Uno de los productos ya no existe" });
			if (!item.producto.enStock)
				return res.status(409).json({
					ok: false,
					message: `"${item.producto.nombre}" ya no está disponible`,
				});
		}

		// Construir line_items para Stripe (importes en céntimos)
		const lineItems = carrito.items.map((item) => ({
			price_data: {
				currency: "eur",
				product_data: { name: item.producto.nombre },
				unit_amount: Math.round(item.producto.precio * 100),
			},
			quantity: item.cantidad,
		}));

		// Guardar userId en metadata para usarlo en el webhook
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
			metadata: { userId: userId.toString() },
		});

		return res.json({ ok: true, sessionId: session.id, url: session.url });
	} catch (error) {
		const status = error.status || 500;
		return res.status(status).json({ ok: false, message: error.message });
	}
});

/**
 * @swagger
 * /api/checkout/webhook:
 *   post:
 *     summary: Webhook de Stripe (uso interno)
 *     description: |
 *       Stripe llama a este endpoint automáticamente cuando el pago se completa.
 *       Verifica la firma del mensaje y, si el evento es `checkout.session.completed`,
 *       crea el pedido, marca el stock como vendido y vacía el carrito.
 *       **No llamar manualmente** — requiere header `stripe-signature` válido.
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload raw enviado por Stripe
 *     responses:
 *       200:
 *         description: Evento recibido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Firma de Stripe inválida
 */
router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	async (req, res) => {
		const sig = req.headers["stripe-signature"];
		let event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET,
			);
		} catch (err) {
			return res
				.status(400)
				.json({ message: `Webhook signature inválida: ${err.message}` });
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			const userId = session.metadata?.userId;
			console.log(userId);
			console.log(session.metadata ?? "No hay metadatos");
			if (userId) {
				// Crear el pedido, marcar el stock y vaciar el carrito
				try {
					await pedidoServicio.checkout(userId, session.id);
				} catch (err) {
					// Logueamos pero respondemos 200 para que Stripe no reintente indefinidamente
					console.error("Error en checkout webhook:", err.message);
				}
			}
		}

		res.json({ received: true });
	},
);

module.exports = router;
