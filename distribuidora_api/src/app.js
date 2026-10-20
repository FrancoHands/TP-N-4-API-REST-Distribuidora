const express = require('express');
const proveedoresRouter = require('./routes/proveedores.routes');
const productosRouter = require('./routes/productos.routes');
const pedidosRouter = require('./routes/pedidos.routes');
const empleadosRouter = require('./routes/empleados.routes');
const clientesRouter = require('./routes/clientes.routes');
const companiasEnvioRouter = require('./routes/companiasEnvio.routes');
const manejarErrores = require('./middlewares/manejarErrores');

const app = express();

app.use(express.json());

app.use('/api/proveedores', proveedoresRouter);
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/companias-envio', companiasEnvioRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(manejarErrores);

module.exports = app;
