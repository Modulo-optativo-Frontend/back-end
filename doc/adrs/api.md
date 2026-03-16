# API Silverline — Documentación

**Base URL:** `http://localhost:3000/api`

Las rutas protegidas requieren el header:

```JS
Authorization: Bearer <token>
```

El token se obtiene en `POST /usuarios/login` o `POST /usuarios/registrar`.

---

## Autenticación (`/api/usuarios`)

### Registrar usuario

```JS
POST /api/usuarios/registrar
```

**Body:**

```json
{
  "name": "Juan García",
  "email": "juan@example.com",
  "password": "mipassword123"
}
```

**Respuesta `201`:**

```json
{
  "status": "success",
  "data": {
    "nombre": "Juan García",
    "token": "<jwt_token>",
    "refreshToken": "<refresh_token>"
  }
}
```

---

### Iniciar sesión

```js
POST /api/usuarios/login
```

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "mipassword123"
}
```

**Respuesta `200`:**

```json
{
  "status": "Success",
  "data": {
    "usuario": {
      "id": "<id>",
      "name": "Juan García",
      "email": "juan@example.com",
      "role": "customer",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "token": "<jwt_token>",
    "refreshToken": "<refresh_token>"
  }
}
```

---

### Renovar token

```js
POST /api/usuarios/refresh
```

**Body:**

```JSON
{
  "refreshToken": "<refresh_token>"
}
```

---

## Productos (`/api/productos`)

### Obtener todos los productos

```Js

GET /api/productos

```

Admite filtros por query string: `?modelo=Air&anio=2021&condicion=A`

**Respuesta `200`:**

```json
{
  "status": "success",
  "data": [ { "..." }, { "..." } ]
}
```

---

### Obtener producto por ID

```JS

GET /api/productos/:id
```

**Respuesta `200`:**

```json
{
  "status": "success",
  "data": {
    "_id": "<id>",
    "nombre": "MacBook Air",
    "modelo": "Air",
    "anio": 2021,
    "chip": "Apple M1",
    "memoriaRamGb": 8,
    "almacenamientoGb": 256,
    "condicion": "A",
    "precio": 799,
    "enStock": true,
    "imagenes": ["/images/macbooks/macbook-air-2021.webp"]
  }
}
```

---

### Crear producto

```Js

POST /api/productos

```

**Body:**

```json
{
  "codigoSku": "MBAIR-M1-2021-8-256-A",
  "nombre": "MacBook Air",
  "modelo": "Air",
  "anio": 2021,
  "chip": "Apple M1",
  "memoriaRamGb": 8,
  "almacenamientoGb": 256,
  "condicion": "A",
  "precio": 799,
  "descripcion": "MacBook Air con chip M1.",
  "enStock": true
}
```

Valores válidos:

- `memoriaRamGb`: `8`, `16`, `32`, `64`
- `almacenamientoGb`: `128`, `256`, `512`, `1024`, `2048`
- `condicion`: `"A"`, `"B"`, `"C"`

**Respuesta `201`:**

```json
{ "status": "success", "data": { "..." } }
```

---

### Actualizar producto

```JS
PUT /api/productos/:id
```

**Body:** Solo los campos a modificar.

```json
{ "precio": 749, "enStock": false }
```

**Respuesta `200`:**

```json
{ "status": "success", "data": { "..." } }
```

---

### Eliminar producto — 🔒 Solo admin

```JS
DELETE /api/productos/:id
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta `200`:**

```json
{ "status": "success", "data": { "..." } }
```

---

## Carrito (`/api/carrito`) — 🔒 Requiere autenticación

Todas las rutas requieren `Authorization: Bearer <token>`. El carrito es por usuario (extraído del token).

### Ver carrito

```JS
GET /api/carrito
```

**Respuesta `200`:**

```JSON
{
  "items": [
    { "productoId": "<id>", "cantidad": 2 }
  ]
}
```

---

### Agregar item

```js
POST /api/carrito/items
```

**Body:**

```json
{ "productoId": "<id_del_producto>" }
```

---

### Quitar item

```JS
DELETE /api/carrito/items/:productoId
```

---

### Vaciar carrito

```JS
DELETE /api/carrito
```

---

## Pedidos (`/api/pedidos`)

### Obtener todos los pedidos

```JS
GET /api/pedidos
```

---

### Mis pedidos — 🔒 Requiere autenticación

```JS
GET /api/pedidos/mis-pedidos
```

**Headers:** `Authorization: Bearer <token>`

---

### Checkout — 🔒 Requiere autenticación

Convierte el carrito activo en un pedido.

```JS
POST /api/pedidos/checkout
```

**Headers:** `Authorization: Bearer <token>`

**Respuesta `201`:**

```json
{
  "ok": true,
  "orderId": "<id_pedido>",
  "total": 799,
  "estado": "pendiente"
}
```

---

### Crear pedido manualmente

```JS
POST /api/pedidos
```

**Body:**

```json
{
  "usuario": "<id_usuario>",
  "items": [
    { "producto": "<id_producto>", "cantidad": 1, "precioUnitario": 799 }
  ]
}
```

---

### Actualizar pedido

```JS
PUT /api/pedidos/:id
```

**Body:** Campos a modificar, ej: `{ "estado": "enviado" }`

---

### Eliminar pedido

```JS
DELETE /api/pedidos/:id
```

---

## Códigos de respuesta

| Código | Significado                  |
|--------|-------------                 |
| `200`  | OK                           |
| `201`  | Creado                       |
| `400`  | Datos inválidos              |
| `401`  | Token ausente o inválido     |
| `403`  | Sin permisos suficientes     |
| `404`  | Recurso no encontrado        |
| `409`  | Conflicto                    |
| `500`  | Error interno del servidor   |
