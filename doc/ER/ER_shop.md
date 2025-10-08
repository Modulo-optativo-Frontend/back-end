# Documentación de entidades del e‑commerce

> Cada atributo indica **por qué existe** (justificación de negocio) y, si es **FK**, se explica la **tabla de destino** y la **relación**.

Tipos: `string`, `int`, `decimal`, `Date` (ISO 8601).

---

## Usuario
| Atributo         | Tipo    | ¿Por qué existe? / Relación |
|------------------|---------|------------------------------|
| **id_usuario**   | string  | Identificador único para referenciar al usuario desde otras tablas (pedidos, direcciones, carrito). |
| nombre           | string  | Mostrar en interfaz y comunicaciones; personaliza la experiencia del cliente. |
| email            | string  | Credencial única de acceso y canal de notificación; evita cuentas duplicadas. |
| contraseña   | string  | Almacenar la contraseña de forma segura |
| rol              | string  | Determinar permisos del usuario (p. ej., `cliente`, `administrador`). |

---

## Dirección
| Atributo           | Tipo   | ¿Por qué existe? / Relación |
|--------------------|--------|------------------------------|
| **id_direccion**   | string | Identificador único de cada dirección guardada para gestionar múltiples destinos por usuario. |
| **fk_id_usuario**  | string | **FK → Usuario(id_usuario)**. Relación **Usuario 1..N Dirección**. Vincula la dirección a su propietario para envíos y facturación. |
| calle              | string | Dato imprescindible para la entrega física del pedido. |
| ciudad             | string | Necesario para la logística y cálculo de rutas. |
| codigo_postal      | string | Indispensable para zonas de reparto, tarifas y validaciones postales. |
| pais               | string | Determina formato, idiomas y restricciones legales de envío. |
| telefono           | string | Permite contacto del repartidor ante incidencias (opcional). |

---

## Categoría
| Atributo           | Tipo   | ¿Por qué existe? / Relación |
|--------------------|--------|------------------------------|
| **id_categoria**   | string | Identificador único de la categoría; organiza el catálogo. |
| nombre             | string | Etiqueta visible para navegación/SEO y filtros. |
| descripcion        | string | Explica el alcance de la categoría para orientar al cliente (opcional). |

---

## Producto
| Atributo           | Tipo    | ¿Por qué existe? / Relación |
|--------------------|---------|------------------------------|
| **id_producto**    | string  | Identificador único del producto para búsquedas, carrito y pedidos. |
| **fk_id_categoria**| string  | **FK → Categoría(id_categoria)**. Relación **Categoría 1..N Producto**. Clasifica el producto para navegación y reporting. |
| nombre             | string  | Denominación comercial mostrada en ficha y listados. |
| descripcion        | string  | Resume características y beneficios para la decisión de compra (opcional). |
| precio             | decimal | Monto vigente del catálogo; base del cálculo de totales. |
| stock              | int     | Controla disponibilidad; evita vender sin existencias. |
| imagenURL          | string  | Presentación visual para mejorar conversión (opcional). |

---

## Carrito
| Atributo             | Tipo   | ¿Por qué existe? / Relación |
|----------------------|--------|------------------------------|
| **id_carrito**       | string | Identificador del estado temporal de compra del usuario. |
| **fk_id_usuario**    | string | **FK → Usuario(id_usuario)**. Relación habitual **Usuario 1..1 Carrito (activo)**. Determina a quién pertenece el carrito. |
| fecha_actualizacion  | Date   | Facilita limpieza de carritos inactivos y sincronización multi‑dispositivo. |

---

## CarritoItem  _(tabla intermedia para Carrito–Producto)_
| Atributo             | Tipo   | ¿Por qué existe? / Relación |
|----------------------|--------|------------------------------|
| **id_item**          | string | Identificador técnico de la línea; simplifica operaciones CRUD. |
| **fk_id_carrito**    | string | **FK → Carrito(id_carrito)**. Agrupa líneas bajo un mismo carrito. |
| **fk_id_producto**   | string | **FK → Producto(id_producto)**. Relación **CarritoItem N..1 Producto** que materializa **Carrito N..M Producto**. |
| cantidad             | int    | Indica cuántas unidades del producto desea el usuario en esa línea. |

---

## Pedido
| Atributo           | Tipo    | ¿Por qué existe? / Relación |
|--------------------|---------|------------------------------|
| **id_pedido**      | string  | Identificador del documento de venta; base para facturación y soporte. |
| **fk_id_usuario**  | string  | **FK → Usuario(id_usuario)**. Relación **Usuario M..N Pedido**. Asigna el pedido al comprador responsable. |
| **fk_id_direccion**| string  | **FK → Dirección(id_direccion)**. Determina la dirección elegida para el envío. Alternativa: snapshot si se requieren históricos inmutables. |
| total              | decimal | Importe global a cobrar; resultado de la suma de líneas e impuestos. |
| estado             | string  | Gestiona el ciclo de vida del pedido (`pendiente`, `pagado`, `enviado`, etc.). |
| fecha_creacion     | Date    | Auditoría, informes y ordenación cronológica. |

---

## PedidoItem  _(tabla intermedia para Pedido–Producto)_
| Atributo               | Tipo    | ¿Por qué existe? / Relación |
|------------------------|---------|------------------------------|
| **id_pedido_item**     | string  | Identificador de la línea del pedido; alternativa a PK compuesta. |
| **fk_id_pedido**       | string  | **FK → Pedido(id_pedido)**. Relación **Pedido 1..N PedidoItem**. Agrupa líneas bajo un pedido. |
| **fk_id_producto**     | string  | **FK → Producto(id_producto)**. Relación **PedidoItem N..1 Producto** que materializa **Pedido N..M Producto**. |
| cantidad               | int     | Unidades vendidas de ese producto en la línea. |
| precio_unitario        | decimal | Precio del producto **congelado** en la compra; preserva histórico aunque cambie el catálogo. |

---

## Pago
| Atributo           | Tipo    | ¿Por qué existe? / Relación |
|--------------------|---------|------------------------------|
| **id_pago**        | string  | Identificador de la transacción de cobro para conciliación y soporte. |
| **fk_id_pedido**   | string  | **FK → Pedido(id_pedido)**. Relación habitual **Pedido 1..1 Pago** (o **1..N** si admites pagos parciales). |
| metodo             | string  | Medio de pago utilizado (`tarjeta`, `paypal`, `transferencia`, `contraReembolso`). |
| estado             | string  | Estado del proceso (`iniciado`, `autorizado`, `completado`, `fallido`, `reembolsado`). |
| importe            | decimal | Importe liquidado; debe cuadrar con el total (o con la parcialidad). |
| fecha_pago         | Date    | Trazabilidad temporal para conciliación con el PSP. |
| referencia_psp     | string  | Identificador devuelto por el proveedor de pagos; facilita reclamaciones (opcional). |

---

## DetalleSeguimiento
| Atributo              | Tipo   | ¿Por qué existe? / Relación |
|-----------------------|--------|------------------------------|
| **id_seguimiento**    | string | Identificador del evento de tracking; permite auditoría del transporte. |
| **fk_id_pedido**      | string | **FK → Pedido(id_pedido)**. Relación **Pedido 1..N DetalleSeguimiento**. Agrupa eventos por pedido. |
| transportista         | string | Indica la empresa responsable del envío (opcional). |
| codigo_seguimiento    | string | Código/URL para consultar el estado en el transportista (opcional). |
| estado                | string | Fase logística (`etiqueta_creada`, `en_transito`, `en_reparto`, `entregado`, `incidencia`). |
| fecha                 | Date   | Ordena cronológicamente los eventos y soporta SLAs. |
