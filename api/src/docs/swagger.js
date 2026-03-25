const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Silverline API",
			version: "1.0.0",
			description:
				"Documentacion de la API REST para usuarios, productos, carrito y pedidos.",
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
				description: "Servidor local",
			},
		],
		tags: [
			{ name: "Auth", description: "Autenticacion y renovacion de tokens" },
			{ name: "Usuarios", description: "Gestion de usuarios" },
			{ name: "Productos", description: "Catalogo de productos" },
			{ name: "Carrito", description: "Carrito del usuario autenticado" },
			{ name: "Pedidos", description: "Gestion y checkout de pedidos" },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				ErrorResponse: {
					type: "object",
					properties: {
						status: { type: "string", example: "error" },
						message: { type: "string", example: "Ha ocurrido un error" },
					},
				},
				UsuarioPublic: {
					type: "object",
					properties: {
						id: { type: "string", example: "67f1234567890abcdef1234" },
						name: { type: "string", example: "Juan Garcia" },
						email: { type: "string", format: "email", example: "juan@example.com" },
						role: {
							type: "string",
							enum: ["admin", "customer"],
							example: "customer",
						},
						createdAt: {
							type: "string",
							format: "date-time",
							example: "2026-01-01T00:00:00.000Z",
						},
					},
				},
				UsuarioBody: {
					type: "object",
					required: ["name", "email", "password"],
					properties: {
						name: { type: "string", example: "Juan Garcia" },
						email: { type: "string", format: "email", example: "juan@example.com" },
						password: { type: "string", example: "mipassword123" },
						role: {
							type: "string",
							enum: ["admin", "customer"],
							example: "customer",
						},
					},
				},
				LoginBody: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: { type: "string", format: "email", example: "juan@example.com" },
						password: { type: "string", example: "mipassword123" },
					},
				},
				RefreshTokenBody: {
					type: "object",
					required: ["refreshToken"],
					properties: {
						refreshToken: {
							type: "string",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh",
						},
					},
				},
				Producto: {
					type: "object",
					properties: {
						_id: { type: "string", example: "67f1234567890abcdef5678" },
						idAlfaNumerico: {
							type: "string",
							example: "AIR2020M1080256A",
							description:
								"Identificador alfanumerico unico generado a partir de modelo, anio, chip, RAM, almacenamiento y condicion.",
						},
						codigoSku: { type: "string", example: "MBAIR-M1-2021-8-256-A" },
						nombre: { type: "string", example: "MacBook Air" },
						precio: { type: "number", example: 799 },
						descripcion: {
							type: "string",
							example: "MacBook Air con chip M1 reacondicionado.",
						},
						enStock: { type: "boolean", example: true },
						modelo: { type: "string", example: "Air" },
						anio: { type: "integer", example: 2021 },
						chip: { type: "string", example: "Apple M1" },
						memoriaRamGb: {
							type: "integer",
							enum: [8, 16, 32, 64],
							example: 8,
						},
						almacenamientoGb: {
							type: "integer",
							enum: [128, 256, 512, 1024, 2048],
							example: 256,
						},
						condicion: {
							type: "string",
							enum: ["A", "B", "C"],
							example: "A",
						},
						imagenes: {
							type: "array",
							items: { type: "string" },
							example: ["/images/macbooks/macbook-air-2018.webp"],
						},
					},
				},
				ProductoBody: {
					type: "object",
					required: [
						"codigoSku",
						"nombre",
						"precio",
						"modelo",
						"anio",
						"chip",
						"memoriaRamGb",
						"almacenamientoGb",
						"condicion",
					],
					properties: {
						codigoSku: { type: "string", example: "MBAIR-M1-2021-8-256-A" },
						nombre: { type: "string", example: "MacBook Air" },
						precio: { type: "number", example: 799 },
						descripcion: {
							type: "string",
							example: "MacBook Air con chip M1 reacondicionado.",
						},
						enStock: { type: "boolean", example: true },
						modelo: { type: "string", example: "Air" },
						anio: { type: "integer", example: 2021 },
						chip: { type: "string", example: "Apple M1" },
						memoriaRamGb: {
							type: "integer",
							enum: [8, 16, 32, 64],
							example: 8,
						},
						almacenamientoGb: {
							type: "integer",
							enum: [128, 256, 512, 1024, 2048],
							example: 256,
						},
						condicion: {
							type: "string",
							enum: ["A", "B", "C"],
							example: "A",
						},
						imagenes: {
							type: "array",
							items: { type: "string" },
						},
					},
				},
				ProductoPatchBody: {
					type: "object",
					properties: {
						codigoSku: { type: "string", example: "MBAIR-M1-2021-8-256-B" },
						nombre: { type: "string", example: "MacBook Air" },
						precio: { type: "number", example: 749 },
						descripcion: {
							type: "string",
							example: "Producto rebajado por oferta.",
						},
						enStock: { type: "boolean", example: false },
						modelo: { type: "string", example: "Air" },
						anio: { type: "integer", example: 2021 },
						chip: { type: "string", example: "Apple M1" },
						memoriaRamGb: {
							type: "integer",
							enum: [8, 16, 32, 64],
							example: 16,
						},
						almacenamientoGb: {
							type: "integer",
							enum: [128, 256, 512, 1024, 2048],
							example: 512,
						},
						condicion: {
							type: "string",
							enum: ["A", "B", "C"],
							example: "B",
						},
						imagenes: {
							type: "array",
							items: { type: "string" },
						},
					},
				},
				CarritoItem: {
					type: "object",
					properties: {
						producto: {
							oneOf: [
								{ type: "string", example: "67f1234567890abcdef5678" },
								{ $ref: "#/components/schemas/Producto" },
							],
						},
						cantidad: { type: "integer", example: 1 },
					},
				},
				PedidoItem: {
					type: "object",
					required: ["producto", "cantidad", "precioUnitario"],
					properties: {
						producto: {
							oneOf: [
								{ type: "string", example: "67f1234567890abcdef5678" },
								{ $ref: "#/components/schemas/Producto" },
							],
						},
						cantidad: { type: "integer", example: 1 },
						precioUnitario: { type: "number", example: 799 },
					},
				},
				Pedido: {
					type: "object",
					properties: {
						_id: { type: "string", example: "67f1234567890abcdef9999" },
						usuario: { type: "string", example: "67f1234567890abcdef1234" },
						items: {
							type: "array",
							items: { $ref: "#/components/schemas/PedidoItem" },
						},
						total: { type: "number", example: 799 },
						estado: {
							type: "string",
							enum: ["pendiente", "procesando", "completado", "cancelado"],
							example: "pendiente",
						},
						fecha: {
							type: "string",
							format: "date-time",
							example: "2026-03-25T10:00:00.000Z",
						},
					},
				},
				PedidoBody: {
					type: "object",
					required: ["usuario", "items", "total"],
					properties: {
						usuario: { type: "string", example: "67f1234567890abcdef1234" },
						items: {
							type: "array",
							items: { $ref: "#/components/schemas/PedidoItem" },
						},
						total: { type: "number", example: 799 },
						estado: {
							type: "string",
							enum: ["pendiente", "procesando", "completado", "cancelado"],
							example: "pendiente",
						},
					},
				},
				PedidoPatchBody: {
					type: "object",
					properties: {
						total: { type: "number", example: 799 },
						estado: {
							type: "string",
							enum: ["pendiente", "procesando", "completado", "cancelado"],
							example: "procesando",
						},
					},
				},
			},
		},
	},
	apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
