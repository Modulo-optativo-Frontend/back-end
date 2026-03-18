# Documentación Técnica del Backend

## Descripción General

API RESTful para plataforma de e-commerce **Silverline**, desarrollada con Node.js, Express y MongoDB. Proporciona servicios para gestión de usuarios, productos, carrito de compras y pedidos.

---

## Índice

1. [Arquitectura](#arquitectura)
2. [Modelos de Datos](#modelos-de-datos)
3. [API Endpoints](#api-endpoints)
4. [Autenticación y Autorización](#autenticación-y-autorización)
5. [Middleware](#middleware)
6. [Flujos de Datos](#flujos-de-datos)
7. [Configuración](#configuración)
8. [Scripts y Utilidades](#scripts-y-utilidades)

---

## Arquitectura

### Estructura de Capas

```text
┌─────────────────────────────────────────────────────────────┐
│                     RUTAS (routes/)                         │
│  - Definen endpoints                                        │
│  - Aplican middleware de autenticación y roles             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               CONTROLADORES (controladores/)               │
│  - Manejan peticiones HTTP                                  │
│  - Validan entrada                                          │
│  - Envían respuestas                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 SERVICIOS (services/)                       │
│  - Lógica de negocio                                       │
│  - Transformación de datos                                  │
│  - Reglas de validación complejas                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  MODELOS (models/)                         │
│  - Esquemas de Mongoose                                    │
│  - Validaciones de esquema                                 │
│  - Hooks pre/post save                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB                               │
│  - Base de datos NoSQL                                     │
│  - Almacenamiento de documentos                            │
└─────────────────────────────────────────────────────────────┘
```

### Tecnologías

| Componente    | Tecnología | Versión |
| ------------- | ---------- | ------- |
| Runtime       | Node.js    | 16.x    |
| Framework     | Express    | 5.1.0   |
| Base de datos | MongoDB    | 8.x     |
| ODM           | Mongoose   | 8.19.0  |
| Auth          | JWT        | 9.0.2   |
| Seguridad     | Bcrypt     | 5.1.1   |
| Desarrollo    | Nodemon    | 3.1.10  |

---

## Modelos de Datos

### Usuario (`User`)

**Propósito**: Gestionar usuarios de la plataforma con roles diferenciados.

```javascript
{
  name: String,           // Nombre del usuario (mín 2 caracteres)
  email: String,          // Email único del usuario
  password: String,       // Contraseña hasheada (mín 8 caracteres)
  role: String,           // Rol: 'admin' | 'customer' (default: 'customer')
  refreshToken: String,   // Token para renovar sesión
  createdAt: Date,       // Fecha de creación
  updatedAt: Date        // Fecha de última actualización
}
```

**Características especiales**:

- Hash automático de contraseñas mediante hook `pre-save`
- Índices compuestos en `role` y `createdAt` para queries optimizadas
- Validación de formato de email con regex

**Índices**:

- `{ role: 1, createdAt: -1 }` - Compuesto para búsquedas por rol y fecha
- `{ role: 1 }` - Búsqueda por rol
- `{ createdAt: -1 }` - Ordenación por fecha

---

### Producto (`Producto`)

**Propósito**: Catálogo de productos (MacBooks reacondicionados).

```javascript
{
  idAlfaNumerico: String,    // ID generado: 3 letras nombre + año (ej: MAC2023)
  codigoSku: String,         // Código SKU único
  nombre: String,            // Nombre del producto
  precio: Number,           // Precio (mín 0)
  descripcion: String,      // Descripción del producto
  enStock: Boolean,         // Disponibilidad (default: true)
  modelo: String,            // Modelo del MacBook
  anio: Number,             // Año (2015-2025)
  chip: String,              // Chip del MacBook
  memoriaRamGb: Number,     // RAM: 8 | 16 | 32 | 64 GB
  almacenamientoGb: Number, // Almacenamiento: 128 | 256 | 512 | 1024 | 2048 GB
  condicion: String,        // Condición: 'A' | 'B' | 'C' (default: 'A')
  imagenes: [String],       // URLs de imágenes
  createdAt: Date,
  updatedAt: Date
}
```

**Características especiales**:

- Generación automática de `idAlfaNumerico` mediante hook `pre-save`
- Índices compuestos en `modelo + anio` y `chip + anio`
- Validación de enums para specs técnicas

**Índices**:

- `{ modelo: 1, anio: -1 }` - Búsqueda por modelo y año
- `{ chip: 1, anio: -1 }` - Búsqueda por chip y año
- `{ codigoSku: 1 }` - Único
- `{ idAlfaNumerico: 1 }` - Único

---

### Carrito (`Carrito`)

**Propósito**: Gestionar carrito de compras del usuario.

```javascript
{
  usuario: ObjectId,         // Referencia a User (único por usuario)
  items: [{
    producto: ObjectId,     // Referencia a Producto
    cantidad: Number       // Cantidad (default: 1, mín: 1)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Características especiales**:

- Un carrito por usuario (unique: true)
- Relación embebida con items
- Timestamps para sincronización multi-dispositivo

---

### Pedido (`Pedido`)

**Propósito**: Gestionar pedidos y transacciones.

```javascript
{
  usuario: ObjectId,         // Referencia a User
  items: [{
    producto: ObjectId,     // Referencia a Producto
    cantidad: Number,       // Cantidad solicitada
    precioUnitario: Number // Precio en momento de compra (congelado)
  }],
  total: Number,            // Total del pedido (mín: 0)
  estado: String,           // Estado: 'pendiente' | 'procesando' | 'completado' | 'cancelado'
  fecha: Date,              // Fecha de creación
  createdAt: Date,
  updatedAt: Date
}
```

**Características especiales**:

- Precio unitario congelado al momento de compra (histórico)
- Validación de al menos un item
- Estados controlados por enum

---

### Dirección (`Direccion`)

**Propósito**: Gestionar direcciones de envío de usuarios.

```javascript
{
  usuario: ObjectId,         // Referencia a User
  calle: String,
  ciudad: String,
  codigoPostal: String,
  pais: String,
  telefono: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Base URL

```http
http://localhost:3000/api
```

---

### Usuarios

#### Autenticación

| Método | Endpoint              | Descripción             | Auth | Body                        |
| ------ | --------------------- | ----------------------- | ---- | --------------------------- |
| POST   | `/usuarios/registrar` | Registrar nuevo usuario | No   | `{ name, email, password }` |
| POST   | `/usuarios/login`     | Iniciar sesión          | No   | `{ email, password }`       |
| POST   | `/usuarios/refresh`   | Renovar access token    | No   | `{ refreshToken }`          |

**Respuesta de registro/login exitosa:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "customer"
  }
}
```

#### CRUD (Requiere Auth + Rol Admin)

| Método | Endpoint        | Descripción               | Auth  | Body                              |
| ------ | --------------- | ------------------------- | ----- | --------------------------------- |
| POST   | `/usuarios`     | Crear usuario             | Admin | `{ name, email, password, role }` |
| GET    | `/usuarios`     | Listar todos los usuarios | Admin | -                                 |
| GET    | `/usuarios/:id` | Obtener usuario por ID    | Admin | -                                 |
| PUT    | `/usuarios/:id` | Actualizar usuario        | Admin | `{ name, email, password, role }` |
| DELETE | `/usuarios/:id` | Eliminar usuario          | Admin | -                                 |

---

### Productos

| Método | Endpoint         | Descripción             | Auth  |
| ------ | ---------------- | ----------------------- | ----- |
| POST   | `/productos`     | Crear producto          | No    |
| GET    | `/productos`     | Listar productos        | No    |
| GET    | `/productos/:id` | Obtener producto por ID | No    |
| PUT    | `/productos/:id` | Actualizar producto     | No    |
| DELETE | `/productos/:id` | Eliminar producto       | Admin |

**Parámetros de query para GET /productos:**

| Parámetro   | Tipo    | Descripción                                      |
| ----------- | ------- | ------------------------------------------------ |
| `modelo`    | string  | Filtrar por modelo                               |
| `anio`      | number  | Filtrar por año                                  |
| `chip`      | string  | Filtrar por chip                                 |
| `precioMin` | number  | Precio mínimo                                    |
| `precioMax` | number  | Precio máximo                                    |
| `enStock`   | boolean | Filtrar por disponibilidad                       |
| `sort`      | string  | Campo de ordenación (`precio`, `nombre`, `anio`) |
| `order`     | string  | Orden: `asc` o `desc`                            |

---

### Carrito

| Método | Endpoint                     | Descripción                 | Auth |
| ------ | ---------------------------- | --------------------------- | ---- |
| GET    | `/carrito`                   | Obtener carrito del usuario | Sí   |
| POST   | `/carrito/items`             | Añadir producto al carrito  | Sí   |
| PUT    | `/carrito/items/:productoId` | Actualizar cantidad         | Sí   |
| DELETE | `/carrito/items/:productoId` | Quitar producto             | Sí   |
| DELETE | `/carrito`                   | Vaciar carrito              | Sí   |

**Body para POST /carrito/items:**

```json
{
  "productoId": "507f1f77bcf86cd799439011",
  "cantidad": 2
}
```

---

### Pedidos

| Método | Endpoint               | Descripción            | Auth  |
| ------ | ---------------------- | ---------------------- | ----- |
| POST   | `/pedidos`             | Crear pedido           | No    |
| POST   | `/pedidos/checkout`    | Finalizar compra       | Sí    |
| GET    | `/pedidos`             | Listar pedidos (admin) | Admin |
| GET    | `/pedidos/mis-pedidos` | Mis pedidos (cliente)  | Sí    |
| GET    | `/pedidos/:id`         | Obtener pedido por ID  | Sí    |
| PUT    | `/pedidos/:id`         | Actualizar estado      | Admin |
| DELETE | `/pedidos/:id`         | Eliminar pedido        | Admin |

**Estados de pedido:**

- `pendiente` - Pedido creado, esperando procesamiento
- `procesando` - Pedido siendo preparado
- `completado` - Pedido completado
- `cancelado` - Pedido cancelado

---

## Autenticación y Autorización

### JWT (JSON Web Tokens)

La API utiliza JWT para autenticación stateless con dos tipos de tokens:

| Token         | Duración | Propósito                    |
| ------------- | -------- | ---------------------------- |
| Access Token  | 15 min   | Acceso a recursos protegidos |
| Refresh Token | 7 días   | Renovar access token         |

### Uso de Tokens

Incluir el token en el header `Authorization`:

```http
Authorization: Bearer <access_token>
```

### Flujo de Autenticación

```text
1. Cliente → POST /usuarios/login
2. Servidor valida credenciales con bcrypt
3. Servidor genera access + refresh token
4. Cliente guarda tokens (localStorage/sessionStorage)
5. Cliente → GET /productos (con Authorization header)
6. Servidor valida token JWT
7. Si token expirado → POST /usuarios/refresh
8. Servidor retorna nuevo access token
```

---

## Middleware

### auth.js

Middleware de autenticación JWT.

```javascript
const auth = require("./middleware/auth");

// Proteger ruta
router.get("/ruta-protegida", auth.auth, controller.metodo);
```

**Funciones:**

- `auth.auth` - Verifica token JWT válido
- `auth.obtenerUsuario` - Extrae usuario del token

### roleMiddle.js

Middleware de autorización por roles.

```javascript
const role = require("./middleware/roleMiddle");

// Solo admin puede acceder
router.delete("/productos/:id", auth.auth, role.soloAdmin, controller.metodo);

// Validar rol específico
router.get("/usuarios", auth.auth, role.validarRole, controller.metodo);
```

**Funciones:**

- `soloAdmin` - Solo permite acceso a usuarios con rol 'admin'
- `validarRole` - Permite acceso a roles específicos

---

## Flujos de Datos

### Flujo de Registro de Usuario

```text
1. POST /api/usuarios/registrar
   Body: { name, email, password }

2. Controlador valida datos de entrada

3. Servicio verifica email único

4. Modelo hashea password (pre-save hook)

5. Se guarda en MongoDB

6. Servicio genera JWT tokens

7. Controlador responde { token, refreshToken, user }
```

### Flujo de Compra

```text
1. GET /api/productos (usuario explora)
2. POST /api/carrito/items (añade al carrito)
3. POST /api/pedidos/checkout (finaliza compra)
   - Crear pedido con items del carrito
   - Congelar precios unitarios
   - Calcular total
   - Cambiar estado a 'pendiente'
4. PUT /api/pedidos/:id (admin actualiza estado)
5. GET /api/pedidos/mis-pedidos (usuario ve historial)
```

---

## Configuración

### Variables de Entorno

| Variable                 | Descripción                      | Valor por defecto                        |
| ------------------------ | -------------------------------- | ---------------------------------------- |
| `PORT`                   | Puerto del servidor              | `3000`                                   |
| `MONGO_URI`              | URI de conexión MongoDB          | `mongodb://localhost:27017/ecommerce_db` |
| `JWT_SECRET`             | Clave secreta para access token  | -                                        |
| `JWT_REFRESH_SECRET`     | Clave secreta para refresh token | -                                        |
| `JWT_EXPIRES_IN`         | Expiración access token          | `15m`                                    |
| `JWT_REFRESH_EXPIRES_IN` | Expiración refresh token         | `7d`                                     |
| `HASH_NUMBER`            | Rounds para bcrypt               | `10`                                     |
| `CORS_ORIGIN`            | Origen permitido para CORS       | `http://localhost:5173`                  |

---

## Scripts y Utilidades

### Scripts Disponibles

| Comando        | Descripción                                  |
| -------------- | -------------------------------------------- |
| `npm run dev`  | Iniciar en modo desarrollo (`nodemon`)       |
| `npm start`    | Iniciar en modo producción                   |
| `npm run seed` | Poblar base de datos con productos de prueba |

### Semillas de Datos

El proyecto incluye scripts para poblar la base de datos:

- `src/scripts/seedProductos.js` - Inserta productos de ejemplo
- `src/scripts/crearAdmin.js` - Crea usuario administrador por defecto

### Docker

```bash
# Iniciar MongoDB
docker-compose up -d

# Ver logs
docker-compose logs -f mongo

# Detener
docker-compose down
```

---

## Códigos de Estado HTTP

| Código | Significado                                |
| ------ | ------------------------------------------ |
| 200    | OK - Solicitud exitosa                     |
| 201    | Created - Recurso creado                   |
| 400    | Bad Request - Datos inválidos              |
| 401    | Unauthorized - Sin autenticación           |
| 403    | Forbidden - Sin permisos                   |
| 404    | Not Found - Recurso no encontrado          |
| 500    | Internal Server Error - Error del servidor |

---

## Manejo de Errores

### Estructura de Respuestas de Error

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Errores Comunes

| Error                | Causa                 | Solución           |
| -------------------- | --------------------- | ------------------ |
| `jwt malformed`      | Token malformado      | Login de nuevo     |
| `Token expired`      | Token expirado        | Usar refresh token |
| `Connection refused` | MongoDB no disponible | Verificar conexión |
| `E11000`             | Campo único duplicado | Cambiar valor      |

---

## Testing

### Endpoints de Prueba

```bash
# Health check
curl http://localhost:3000/

# Registro
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Listar productos
curl http://localhost:3000/api/productos
```

---

## Contribución

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/Nombre`
3. Commit: `git commit -m 'Add: Descripción'`
4. Push: `git push origin feature/Nombre`
5. Pull Request

---

Última actualización: Marzo 2026
