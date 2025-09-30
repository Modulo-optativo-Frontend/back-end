
# Modelo de dominio e‑commerce — Tablas de atributos

> Cada entidad se documenta con **atributo**, **tipo** y **descripción**. Tipos genéricos: `string`, `int`, `decimal`, `Date` (ISO).

---

## Usuario
| Atributo         | Tipo                              | Descripción                                                     |
|------------------|-----------------------------------|-----------------------------------------------------------------|
| usuarioId        | string                            | Identificador único del usuario.                                |
| nombre           | string                            | Nombre completo visible.                                        |
| email            | string                            | Correo electrónico único para login y notificaciones.           |
| contrasenaHash   | string                            | Hash de la contraseña (no almacenar texto plano).               |
| rol              | 'cliente' \| 'administrador'      | Rol del usuario dentro del sistema.                             |

---

## Dirección
| Atributo     | Tipo   | Descripción                                                     |
|--------------|--------|-----------------------------------------------------------------|
| direccionId  | string | Identificador único de la dirección.                            |
| usuarioId    | string | FK al usuario propietario de la dirección.                      |
| calle        | string | Calle y número.                                                 |
| ciudad       | string | Ciudad / localidad.                                             |
| codigoPostal | string | Código postal.                                                  |
| pais         | string | País.                                                           |
| telefono     | string | Teléfono de contacto (opcional).                                |

---

## Categoría
| Atributo     | Tipo   | Descripción                              |
|--------------|--------|------------------------------------------|
| categoriaId  | string | Identificador único de la categoría.     |
| nombre       | string | Nombre de la categoría.                  |
| descripcion  | string | Descripción breve (opcional).            |

---

## Producto
| Atributo    | Tipo    | Descripción                                                    |
|-------------|---------|----------------------------------------------------------------|
| productoId  | string  | Identificador único del producto.                              |
| categoriaId | string  | FK a la categoría a la que pertenece.                          |
| nombre      | string  | Nombre visible del producto.                                   |
| descripcion | string  | Descripción resumida (opcional).                               |
| precio      | decimal | Precio actual del producto (moneda base del sistema).          |
| stock       | int     | Unidades disponibles en inventario.                            |
| imagenUrl   | string  | URL de la imagen principal del producto (opcional).            |

---

## Carrito
| Atributo           | Tipo   | Descripción                                            |
|--------------------|--------|--------------------------------------------------------|
| carritoId          | string | Identificador único del carrito.                       |
| usuarioId          | string | FK al usuario dueño del carrito (carrito activo).      |
| fechaActualizacion | Date   | Fecha/hora de la última modificación del carrito.      |

---

## CarritoItem
| Atributo   | Tipo   | Descripción                                    |
|------------|--------|------------------------------------------------|
| carritoId  | string | FK al carrito (parte de la PK compuesta).      |
| productoId | string | FK al producto (parte de la PK compuesta).     |
| cantidad   | int    | Unidades del producto en el carrito.           |

---

## Pedido
| Atributo          | Tipo                                                                 | Descripción                                                                      |
|-------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------|
| pedidoId          | string                                                               | Identificador único del pedido.                                                  |
| usuarioId         | string                                                               | FK al usuario que realiza el pedido.                                             |
| direccionEnvioId  | string                                                               | FK a la dirección seleccionada para el envío (o snapshot si se usa esa estrategia). |
| total             | decimal                                                              | Importe total del pedido.                                                        |
| estado            | 'pendiente' \| 'pagado' \| 'enviado' \| 'entregado' \| 'cancelado'  | Estado del ciclo de vida del pedido.                                             |
| fechaCreacion     | Date                                                                 | Fecha/hora de creación del pedido.                                               |

---

## PedidoItem
| Atributo       | Tipo    | Descripción                                                                  |
|----------------|---------|------------------------------------------------------------------------------|
| pedidoId       | string  | FK al pedido (parte de la PK compuesta).                                     |
| productoId     | string  | FK al producto (parte de la PK compuesta).                                   |
| cantidad       | int     | Unidades del producto en el pedido.                                          |
| precioUnitario | decimal | Precio unitario del producto en el momento de la compra (histórico).         |
| subtotal       | decimal | Importe de la línea (= precioUnitario × cantidad).                           |

---

## Pago
| Atributo            | Tipo                                                                 | Descripción                                               |
|---------------------|----------------------------------------------------------------------|-----------------------------------------------------------|
| pagoId              | string                                                               | Identificador único del pago.                             |
| pedidoId            | string                                                               | FK al pedido asociado.                                    |
| metodo              | 'tarjeta' \| 'paypal' \| 'transferencia' \| 'contraReembolso'        | Método de pago utilizado.                                 |
| estado              | 'iniciado' \| 'autorizado' \| 'completado' \| 'fallido' \| 'reembolsado' | Estado del pago.                                       |
| importe             | decimal                                                              | Importe liquidado.                                        |
| referenciaProveedor | string                                                               | Identificador del proveedor/PSP (opcional).               |
| fechaPago           | Date                                                                 | Fecha/hora del intento o liquidación del pago.            |

---

## DetalleSeguimiento
| Atributo          | Tipo   | Descripción                                                       |
|-------------------|--------|-------------------------------------------------------------------|
| seguimientoId     | string | Identificador único del evento de seguimiento.                    |
| pedidoId          | string | FK al pedido.                                                     |
| transportista     | string | Nombre del transportista (opcional).                              |
| codigoSeguimiento | string | Código/URL de tracking (opcional).                                |
| estado            | string | 'etiqueta_creada' \| 'en_transito' \| 'en_reparto' \| 'entregado' \| 'incidencia' |
| nota              | string | Observación libre (opcional).                                     |
| fecha             | Date   | Marca temporal del evento.                                        |
