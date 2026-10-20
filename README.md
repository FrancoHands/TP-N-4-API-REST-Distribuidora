# API REST - Distribuidora

TP N° 4 de Backend. API REST para administrar una distribuidora de alimentos y bebidas, hecha con Node.js, Express y MySQL (consultas SQL con `mysql2`, sin ORM).

## Cómo ejecutarlo

1. Prender MySQL (en XAMPP) e importar `database.sql`. El script borra y vuelve a crear la base `distribuidora` con datos de prueba.
2. Copiar `.env.example` como `.env` y revisar los datos de conexión.
3. Instalar y arrancar:

```bash
npm install
npm start
```

El servidor queda en `http://localhost:3000`. Con `npm run dev` se usa nodemon.

## Estructura

```
database.sql            crea la base, las tablas y los datos de prueba
esquema_relacional.jpg  esquema relacional
src/
  config/db.js          pool de conexiones (mysql2/promise)
  routes/               rutas de cada recurso
  controllers/          reciben la petición, validan y responden
  models/               consultas SQL (único lugar donde se usa la base)
  middlewares/          validarId y manejo de errores
tests/
  casos-de-prueba.postman_collection.json
```

## Base de datos

Tablas: `proveedores`, `productos`, `clientes`, `empleados`, `companias_envio`, `pedidos` y `detalle_pedido`.

- Un proveedor tiene muchos productos (1:N).
- Un pedido es de un cliente, lo atiende un empleado y lo envía una compañía (3 claves foráneas en `pedidos`).
- Pedidos y productos son N:M, por eso existe la tabla intermedia `detalle_pedido`.

## Endpoints

Cada recurso tiene `GET /`, `GET /:id`, `POST /`, `PUT /:id` y `DELETE /:id`.

| Recurso | Filtro (query) | JOIN | Agregación |
|---|---|---|---|
| `/api/proveedores` | `nombre` | `/:id/productos` | `/estadisticas` (COUNT, AVG) |
| `/api/productos` | `categoria`, `precio_max` | el listado incluye el proveedor | `/estadisticas` (por categoría) |
| `/api/clientes` | `ciudad` | `/:id/pedidos` | `/estadisticas` (pedidos y total facturado) |
| `/api/empleados` | `cargo` | `/:id/pedidos` | `/estadisticas` (pedidos y total vendido) |
| `/api/companias-envio` | `nombre` | `/:id/pedidos` | `/estadisticas` (pedidos por compañía) |
| `/api/pedidos` | `cliente_id` | el listado incluye cliente, empleado y compañía | el total de cada pedido (SUM) |

Ejemplo para crear un pedido:

```json
POST /api/pedidos
{
  "cliente_id": 1,
  "empleado_id": 1,
  "compania_envio_id": 1,
  "items": [
    { "producto_id": 1, "cantidad": 10, "precio_unitario": 1200 },
    { "producto_id": 3, "cantidad": 5, "precio_unitario": 3200 }
  ]
}
```

El pedido y sus items se guardan en una transacción: si algo falla se hace rollback.

## Errores

Las consultas usan parámetros (`?`), nunca se arma el SQL concatenando datos del usuario. Los errores se capturan en un middleware global y se responde con JSON, sin mostrar el error de MySQL:

| Código | Cuándo |
|---|---|
| 400 | faltan datos, id inválido o un id relacionado no existe |
| 404 | recurso o ruta no encontrados |
| 409 | email/CUIT repetido o registro que otro usa |
| 500 | error interno |

## Pruebas

Importar `tests/casos-de-prueba.postman_collection.json` en Postman y ejecutarla con el Collection Runner, en orden y con la base recién cargada con `database.sql`.
