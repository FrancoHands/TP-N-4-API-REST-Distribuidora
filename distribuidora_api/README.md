# API REST - Distribuidora

TP N° 5 de Backend. API REST para administrar una distribuidora de alimentos y bebidas, hecha con Node.js, Express, TypeScript (ES Modules) y el ORM Prisma sobre MySQL.

## Cómo ejecutarlo

1. Levantar MySQL con Docker. Al crearse el contenedor se importa `database.sql` (borra y vuelve a crear la base `distribuidora` con datos de prueba):

```bash
docker compose up -d
```

2. Copiar `.env.example` como `.env` y revisar `DATABASE_URL` (por defecto `mysql://root:root@localhost:3306/distribuidora`).
3. Instalar, generar el cliente de Prisma y arrancar:

```bash
npm install
npx prisma generate
npm run dev
```

El servidor queda en `http://localhost:3000`. Para producción: `npm run build` y `npm start`.

Para reiniciar la base desde cero: `docker compose down -v && docker compose up -d`.

## Estructura

```
database.sql            crea la base, las tablas y los datos de prueba
esquema_relacional.jpg  esquema relacional
docker-compose.yml      MySQL 8 para desarrollo
prisma/schema.prisma    modelos de Prisma (generado con prisma db pull)
prisma/migrations/      migración inicial (0_init) para recrear la base con Prisma
prisma.config.ts        configuración del CLI de Prisma
src/
  config/prisma.ts      conexión: única instancia de PrismaClient con pool de conexiones
  routes/               rutas de cada recurso
  controllers/          reciben la petición, validan y responden
  models/               acceso a datos con Prisma (único lugar donde se usa la base)
  middlewares/          validarId y manejo de errores
  utils/                funciones auxiliares (total de un pedido)
tests/
  casos-de-prueba.postman_collection.json
```

## Base de datos

Tablas: `proveedores`, `productos`, `clientes`, `empleados`, `companias_envio`, `pedidos` y `detalle_pedido`.

- Un proveedor tiene muchos productos (1:N).
- Un pedido es de un cliente, lo atiende un empleado y lo envía una compañía (3 claves foráneas en `pedidos`).
- Pedidos y productos son N:M, por eso existe la tabla intermedia `detalle_pedido`.

Prisma administra el esquema con migraciones. La migración `0_init` crea las 7 tablas, las claves foráneas y los `CHECK` (que Prisma no modela y se agregaron a mano al final del archivo). Para crear la base vacía con Prisma, en vez de importar `database.sql`:

```bash
npx prisma migrate deploy
```

Cuando se cambie `schema.prisma`, se genera una migración nueva con `npx prisma migrate dev --name <cambio>`.

El pool de conexiones se configura en `src/config/prisma.ts` (`connectionLimit=10`).

## Endpoints

Cada recurso tiene `GET /`, `GET /:id`, `POST /`, `PUT /:id` y `DELETE /:id`.

| Recurso | Filtro (query) | JOIN | Agregación |
|---|---|---|---|
| `/api/proveedores` | `nombre` | `/:id/productos` | `/estadisticas` (COUNT, AVG) |
| `/api/productos` | `categoria`, `precio_max` | el listado incluye el proveedor | `/estadisticas` (por categoría) |
| `/api/clientes` | `ciudad` | `/:id/pedidos` | `/estadisticas` (pedidos y total facturado) |
| `/api/empleados` | `cargo` | `/:id/pedidos` | `/estadisticas` (pedidos y total vendido) |
| `/api/companias-envio` | `nombre` | `/:id/pedidos` | `/estadisticas` (pedidos por compañía) |
| `/api/pedidos` | `cliente_id` | el listado incluye cliente, empleado y compañía | el total de cada pedido |
| `/api/informes/ventas-por-proveedor` | `desde`, `hasta` (AAAA-MM-DD) | 4 tablas con SQL puro | COUNT y SUM por proveedor |

En los modelos las consultas se hacen con Prisma Client: `findMany`/`findUnique` con `where`, `include` y `select` para filtros y JOINs, y `groupBy` con `_count`, `_sum`, `_avg`, `_min` y `_max` para las agregaciones.

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

El pedido y sus items se guardan con un `create` anidado de Prisma, que se ejecuta en una transacción: si algo falla no se guarda nada.

## Errores

Los errores se capturan en un middleware global (`src/middlewares/manejarErrores.ts`) y se responde con JSON, sin mostrar el stack ni el SQL:

| Código | Cuándo |
|---|---|
| 400 | faltan datos, id inválido, valor fuera de rango o un id relacionado no existe |
| 404 | recurso o ruta no encontrados (`P2025`) |
| 409 | email/CUIT repetido (`P2002`) o registro que otro usa (`P2003` al borrar) |
| 500 | error interno |

## Pruebas

Importar `tests/casos-de-prueba.postman_collection.json` en Postman y ejecutarla con el Collection Runner, en orden y con la base recién cargada con `database.sql`. Son 95 casos con sus verificaciones de código de estado, y cada carpeta borra lo que crea.

## Prisma híbrido

### 1. `$queryRaw` vs `$executeRaw`

Los dos ejecutan SQL escrito a mano, pero para cosas distintas:

| | `$queryRaw` | `$executeRaw` |
|---|---|---|
| Uso | lecturas (`SELECT`) | escrituras (`INSERT`, `UPDATE`, `DELETE`, DDL) |
| Devuelve | un array con las filas (objetos) | un número: la cantidad de filas afectadas |

```ts
// $queryRaw: devuelve filas
const filas = await prisma.$queryRaw`SELECT id, nombre FROM proveedores WHERE id = ${id}`;

// $executeRaw: devuelve cuántas filas cambió
const cambiadas = await prisma.$executeRaw`UPDATE productos SET stock = stock - ${cantidad} WHERE id = ${id}`;
```

Con `$queryRaw` haría reportes y consultas que Prisma Client no expresa (como el informe de este proyecto). Con `$executeRaw` haría actualizaciones masivas o con expresiones (`stock = stock - 1`) y sentencias que no devuelven datos. Existen también `$queryRawUnsafe` y `$executeRawUnsafe`, que reciben un string común y por eso no protegen contra inyección SQL.

### 2. Tagged template literals e inyección SQL

Con `` prisma.$queryRaw`SELECT * FROM clientes WHERE id = ${id}` `` Prisma no arma un string: recibe por separado las partes fijas del SQL y los valores de `${...}`. Envía a MySQL la consulta con marcadores (`SELECT * FROM clientes WHERE id = ?`) y los valores como parámetros aparte. La base de datos ya compiló la consulta antes de recibir el dato, así que el valor se trata siempre como dato y nunca como código SQL.

Concatenar strings (`"... WHERE id = " + id`) mezcla la entrada del usuario con el SQL. Si el usuario manda `1 OR 1=1`, o `1; DROP TABLE clientes`, ese texto pasa a ser parte de la consulta y la base lo ejecuta: puede leer todos los registros, modificarlos o borrarlos. Por eso nunca hay que armar consultas concatenando o con `${}` dentro de un string común (`` `...${id}` `` sin la etiqueta `$queryRaw`).

En el informe, los filtros opcionales se arman con `Prisma.sql` y `Prisma.empty`, que mantienen la parametrización.

### 3. Cuándo usar SQL puro y no Prisma Client

- Consultas muy complejas: JOINs múltiples con agregaciones, subconsultas, CTE (`WITH`) o funciones de ventana (`ROW_NUMBER`, `RANK`), que Prisma Client no soporta o resuelve con varias consultas.
- Reportes pesados donde importa el rendimiento y conviene que la base haga todo el cálculo en una sola consulta, en vez de traer filas y sumarlas en JavaScript.
- Funciones propias de MySQL (por ejemplo `DATE_FORMAT`, `JSON_TABLE`) o `STORED PROCEDURE`, vistas y triggers.
- Operaciones masivas (actualizar o insertar miles de filas de una vez) o scripts de migración de datos.

Si se usa SQL puro, igual se hace desde Prisma (`$queryRaw`) para aprovechar el pool y la misma conexión, y con valores siempre parametrizados.

### 4. Informe con SQL puro

`GET /api/informes/ventas-por-proveedor` (`src/models/informes.model.ts`) usa `prisma.$queryRaw` con 4 JOINs (`proveedores`, `productos`, `detalle_pedido`, `pedidos`), `COUNT(DISTINCT ...)`, `SUM` y `GROUP BY`, ordenado por monto. Acepta `?desde=` y `?hasta=` como filtros. `COUNT` y `SUM` llegan como `BigInt` y `Decimal`, y se pasan a número antes de responder porque `JSON.stringify` no soporta `BigInt`.
