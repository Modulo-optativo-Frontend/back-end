const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/controladorUsuario.js");
const auth = require("../middleware/auth.js");
const role = require("../middleware/roleMiddle.js");

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioBody'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
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
 *                   example: Usuario creado exitosamente
 *       400:
 *         description: Datos de entrada invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token requerido o invalido
 *       403:
 *         description: Acceso prohibido
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                     $ref: '#/components/schemas/UsuarioPublic'
 *       401:
 *         description: Token requerido o invalido
 *       403:
 *         description: Acceso prohibido
 *       500:
 *         description: Error interno del servidor
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por identificador
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, customer]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioPublic'
 *       400:
 *         description: Error de validacion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token requerido o invalido
 *       403:
 *         description: Acceso prohibido
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Eliminar un usuario por identificador
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UsuarioPublic'
 *       400:
 *         description: Error eliminando usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token requerido o invalido
 *       403:
 *         description: Acceso prohibido
 *       404:
 *         description: Usuario no encontrado
 *
 * /api/usuarios/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioBody'
 *     responses:
 *       201:
 *         description: Usuario registrado con token y refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: Juan Garcia
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El usuario ya existe
 *
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesion
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/UsuarioPublic'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Credenciales invalidas
 *       404:
 *         description: Usuario no encontrado
 *
 * /api/usuarios/refresh:
 *   post:
 *     summary: Renovar access token con refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenBody'
 *     responses:
 *       200:
 *         description: Token renovado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       $ref: '#/components/schemas/UsuarioPublic'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh
 *       400:
 *         description: Refresh token requerido
 *       401:
 *         description: Refresh token invalido o caducado
 *       404:
 *         description: Usuario no encontrado
 */

// === RUTAS CRUD BÁSICAS ===
// POST / - Crear usuario (datos en body)
// GET / - Obtener todos los usuarios
// PUT /:id - Actualizar usuario por ID (datos en body)
// DELETE /:id - Eliminar usuario por ID

//Crud completo
router.post("/", auth.auth, role.validarRole, usuarioController.crearUsuario);
router.get("/", auth.auth, role.validarRole, usuarioController.obtenerUsuarios);
router.put(
	"/:id",
	auth.auth,
	role.validarRole,
	usuarioController.actualizarUsuario,
);
router.delete(
	"/:id",
	auth.auth,
	role.validarRole,
	usuarioController.eliminarUsuario,
);

// === RUTAS DE AUTENTICACIÓN ===
// POST /registrar - Registrar nuevo usuario (name, email, password en body) → devuelve token
// POST /login - Iniciar sesión (email, password en body) → devuelve usuario y token

//usuario
router.post("/registrar", usuarioController.registrarUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/refresh", usuarioController.refresh);

//Exports
module.exports = router;
