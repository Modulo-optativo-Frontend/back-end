# E-Commerce Backend API

> API RESTful para aplicación de e-commerce con autenticación JWT, gestión de productos, usuarios y pedidos.

[![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelos de Datos](#modelos-de-datos)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticaciones)
- [Troubleshooting](#troubleshooting)

## Características

- ✅ **Autenticación JWT** con tokens de acceso y refresh
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **CRUD completo** para usuarios, productos y pedidos
- ✅ **Validación de datos** mediante esquemas de Mongoose
- ✅ **Arquitectura en capas** (Rutas → Controladores → Servicios → Modelos)
- ✅ **Middleware de autenticación** para rutas protegidas
- ✅ **Generación automática** de IDs alfanuméricos para productos
- ✅ **Índices optimizados** para consultas eficientes en MongoDB

## Stack Tecnológico

### Backend Framework

- **Node.js** - Entorno de ejecución JavaScript
- **Express 5.1.0** - Framework web minimalista y flexible

### Base de Datos

- **MongoDB** - Base de datos NoSQL orientada a documentos
- **Mongoose 8.19.0** - ODM (Object Data Modeling) para MongoDB

### Seguridad y Autenticación

- **JWT (jsonwebtoken 9.0.2)** - Autenticación basada en tokens
- **Bcrypt 5.1.1** - Hash de contraseñas con salt

### Desarrollo

- **Nodemon 3.1.10** - Recarga automática del servidor
- **dotenv 17.2.3** - Gestión de variables de entorno

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 14.x ([Descargar](https://nodejs.org/))
- **npm** >= 6.x o **yarn** >= 1.22.x
- **MongoDB** >= 4.4
  - Instalación local ([Descargar](https://www.mongodb.com/try/download/community))
  - O cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recomendado)
- **Git** ([Descargar](https://git-scm.com/))

### Herramientas Recomendadas

- [Postman](https://www.postman.com/) - Testing de APIs
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) - GUI para MongoDB
- [VS Code](https://code.visualstudio.com/) - Editor de código

## Instalación

### Clonar el Repositorio

```bash
git clone https://github.com/Modulo-optativo-Frontend/back-end.git
cd back-end/api
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

## Configuración

Crea un archivo `.env` en el directorio `api/` con las siguientes variables:

```env
# Servidor
PORT=3000

# Base de Datos MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce_db
# O para MongoDB Atlas:
# MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/ecommerce_db

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_super_segura_jwt
JWT_REFRESH_SECRET=tu_clave_secreta_super_segura_refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
HASH_NUMBER=tuNumeroFav
```

> **Importante**: Nunca subas el archivo `.env` a Git. Asegúrate de que esté en `.gitignore`.

## Ejecución

### Modo Desarrollo (con hot-reload)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará disponible en:

```bash
http://localhost:3000
```

## Estructura del Proyecto

```plaintext
back-end/
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Configuración de conexión MongoDB
│   │   ├── models/
│   │   │   ├── Usuario.js            # Schema de usuarios
│   │   │   ├── Producto.js           # Schema de productos
│   │   │   ├── Pedido.js             # Schema de pedidos
│   │   │   └── Direccion.js          # Schema de direcciones
│   │   ├── routes/
│   │   │   ├── usuarioRoutes.js      # Endpoints de usuarios
│   │   │   ├── productoRoutes.js     # Endpoints de productos
│   │   │   └── pedidoRoutes.js       # Endpoints de pedidos
│   │   ├── controladores/
│   │   │   ├── controladorUsuario.js # Lógica de usuarios
│   │   │   ├── controladorProducto.js # Lógica de productos
│   │   │   ├── controladorPedido.js  # Lógica de pedidos
│   │   │   └── controladorDireccion.js
│   │   ├── services/
│   │   │   ├── servicioUsuario.js    # Capa de negocio usuarios
│   │   │   ├── servicioProducto.js   # Capa de negocio productos
│   │   │   ├── servicioPedido.js     # Capa de negocio pedidos
│   │   │   └── servicioDireccion.js
│   │   ├── middleware/
│   │   │   └── auth.js               # Middleware JWT
│   │   ├── index.js                  # Punto de entrada principal
│   │   └── index.html                # Página de bienvenida
│   ├── .env                          # Variables de entorno (no versionado)
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── doc/
│   ├── doc.md
│   ├── adrs/                         # Architecture Decision Records
│   │   ├── ADR-001.md
│   │   └── ADR-002.md
│   └── ER/                           # Diagramas Entidad-Relación
│       ├── ER_diagrama_adria_martinez.jpg
│       └── ER_shop.md
└── README.md
```

### Arquitectura en Capas

```bash
Cliente → Rutas → Controladores → Servicios → Modelos → MongoDB
```

1. **Rutas**: Definen los endpoints y aplican middleware
2. **Controladores**: Manejan las peticiones HTTP y respuestas
3. **Servicios**: Contienen la lógica de negocio
4. **Modelos**: Definen esquemas y validan datos

## Modelos de Datos

### Usuario (`User`)

```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
    // Hasheada automáticamente con bcrypt
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  refreshToken: {
    type: String,
    default: null
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Características especiales:**

- Hash automático de contraseñas mediante hook `pre-save`
- Índices compuestos en `role` y `createdAt` para queries optimizadas
- Validación de formato de email con regex

### Producto (`Product`)

```javascript
{
  idAlfaNumerico: {
    type: String,
    required: true,
    unique: true
    // Generado automáticamente: primeras 3 letras del nombre + año
    // Ejemplo: MacBook 2023 → "MAC2023"
  },
  codigoSku: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: String,
  enStock: {
    type: Boolean,
    default: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  anio: {
    type: Number,
    min: 2015,
    max: 2025
  },
  chip: {
    type: String,
    trim: true
  },
  memoriaRamGb: {
    type: Number,
    enum: [8, 16, 32, 64]
  },
  almacenamientoGb: {
    type: Number,
    enum: [128, 256, 512, 1024, 2048]
  },
  condicion: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'A'
  },
  imagenes: [String]
}
```

**Características especiales:**

- Generación automática de `idAlfaNumerico` mediante hook `pre-save`
- Índices compuestos en `modelo + anio` y `chip + anio`
- Validación de enums para specs técnicas

### Pedido (`Order`)

```javascript
{
  id_pedido: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}
```

## API Endpoints

### Base URL

```bash
http://localhost:3000/api
```

### Usuarios

#### Autenticación

| Método | Endpoint              | Descripción             | Body                        |
| ------ | --------------------- | ----------------------- | --------------------------- |
| POST   | `/usuarios/registrar` | Registrar nuevo usuario | `{ name, email, password }` |
| POST   | `/usuarios/login`     | Iniciar sesión          | `{ email, password }`       |
| POST   | `/usuarios/refresh`   | Renovar access token    | `{ refreshToken }`          |

**Ejemplo de Registro:**

```bash
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**

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

#### CRUD Usuarios ( Requiere Autenticación)

| Método | Endpoint        | Descripción                |
| ------ | --------------- | -------------------------- |
| GET    | `/usuarios`     | Obtener todos los usuarios |
| PUT    | `/usuarios/:id` | Actualizar usuario por ID  |
| DELETE | `/usuarios/:id` | Eliminar usuario por ID    |

### Productos

| Método | Endpoint         | Descripción                 | Auth |
| ------ | ---------------- | --------------------------- | ---- |
| POST   | `/productos`     | Crear nuevo producto        | No   |
| GET    | `/productos`     | Obtener todos los productos | No   |
| GET    | `/productos/:id` | Obtener producto por ID     | No   |
| PUT    | `/productos/:id` | Actualizar producto         | No   |
| DELETE | `/productos/:id` | Eliminar producto           | No   |

**Ejemplo de Creación de Producto:**

```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "MacBook Pro",
    "precio": 2499.99,
    "codigoSku": "MBP-M3-16-512",
    "modelo": "MacBook Pro 16",
    "anio": 2023,
    "chip": "M3 Pro",
    "memoriaRamGb": 16,
    "almacenamientoGb": 512,
    "condicion": "A",
    "descripcion": "MacBook Pro 16 con chip M3 Pro",
    "enStock": true,
    "imagenes": ["url1.jpg", "url2.jpg"]
  }'
```

### Pedidos

| Método | Endpoint       | Descripción               |
| ------ | -------------- | ------------------------- |
| POST   | `/pedidos`     | Crear nuevo pedido        |
| GET    | `/pedidos`     | Obtener todos los pedidos |
| PUT    | `/pedidos/:id` | Actualizar pedido         |
| DELETE | `/pedidos/:id` | Eliminar pedido           |

## Autenticaciones

### JWT (JSON Web Tokens)

La API utiliza JWT para autenticación stateless. Existen dos tipos de tokens:

1. **Access Token**: Corta duración (15 min), para acceder a recursos protegidos
2. **Refresh Token**: Larga duración (7 días), para renovar access tokens

### Uso de Tokens

Para acceder a rutas protegidas, incluye el token en el header:

```http
Authorization: Bearer <access_token>
```

**Ejemplo con curl:**

```bash
curl - GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Ejemplo con JavaScript (fetch):**

```javascript
fetch("http://localhost:3000/api/usuarios", {
 headers: {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
 },
});
```

### Flujo de Autenticación

```bash
1. Cliente → POST /usuarios/login → Servidor
2. Servidor valida credenciales
3. Servidor ← { accessToken, refreshToken, user } ← Servidor
4. Cliente guarda tokens (localStorage/sessionStorage)
5. Cliente → GET /usuarios (con Authorization header) → Servidor
6. Servidor valida token JWT
7. Si token expirado → POST /usuarios/refresh → Servidor
8. Servidor ← { nuevo accessToken } ← Servidor
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con nodemon)
npm run dev

# Ejecutar en modo producción
npm start

# Verificar versión de Node.js
node --version

# Verificar versión de npm
npm --version

# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json && npm install
```

## Troubleshooting

### Error: "Cannot find module"

**Causa**: Dependencias no instaladas correctamente.

**Solución**:

```bash
cd api
npm install
```

### Error: "Connection refused" MongoDB

**Causa**: MongoDB no está ejecutándose o la URI es incorrecta.

**Solución**:

```bash
# Verificar si MongoDB está corriendo (Linux/Mac)
sudo systemctl status mongod

# Iniciar MongoDB
sudo systemctl start mongod

# Verificar conexión
mongo --eval "db.adminCommand('ping')"
```

Para MongoDB Atlas, verifica:

- URI correcta en `.env`
- IP whitelistada en Atlas
- Credenciales correctas

### Error: "JWT malformed" o "Token expired"

**Causa**: Token inválido o expirado.

**Solución**:

```bash
# Usar el endpoint /refresh para obtener nuevo token
POST /api/usuarios/refresh
{
  "refreshToken": "<refresh_token>"
}
```

### Error: "Port 3000 is already in use"

**Causa**: El puerto ya está siendo utilizado.

**Solución**:

```bash
# Encontrar proceso usando el puerto (Windows)
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F

# O cambiar el puerto en .env
PORT=3001
```

### Error: "bcrypt error"

**Causa**: Problemas con la compilación nativa de bcrypt.

**Solución**:

```bash
npm uninstall bcrypt
npm install bcrypt --save
```

## Testing

### Postman Collection

Importa la colección de Postman para probar todos los endpoints:

1. Abre Postman
2. Importa la colección desde `doc/postman/`
3. Configura las variables de entorno:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (se actualiza automáticamente tras login)

### Testing Manual

```bash
# Health check
curl http://localhost:3000/

# Registrar usuario
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## Docker (Opcional)

```bash
# Build imagen
docker build -t ecommerce-api .

# Run contenedor
docker run -p 3000:3000 --env-file .env ecommerce-api
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature:

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit tus cambios:

   ```bash
   git commit -m 'Add: AmazingFeature'
   ```

4. Push a la rama:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Abre un Pull Request

### Convenciones de Commits

```bash
Add: Nueva funcionalidad
Fix: Corrección de bug
Update: Actualización de código existente
Refactor: Refactorización sin cambios funcionales
Docs: Cambios en documentación
Style: Cambios de formato/estilo
Test: Adición o modificación de tests
```

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Equipo de Desarrollo** - [Módulo Optativo Frontend](https://github.com/Modulo-optativo-Frontend)

## Contacto

Para preguntas, sugerencias o reportar issues:

- **Issues**: [GitHub Issues](https://github.com/Modulo-optativo-Frontend/back-end/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Modulo-optativo-Frontend/back-end/discussions)

---

**Última actualización**: Noviembre 2025
