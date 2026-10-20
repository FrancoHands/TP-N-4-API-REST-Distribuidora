import express from 'express';
import proveedoresRouter from './routes/proveedores.routes.js';
import productosRouter from './routes/productos.routes.js';
import empleadosRouter from './routes/empleados.routes.js';
import clientesRouter from './routes/clientes.routes.js';
import companiasEnvioRouter from './routes/companiasEnvio.routes.js';
import pedidosRouter from './routes/pedidos.routes.js';
import informesRouter from './routes/informes.routes.js';
import manejarErrores from './middlewares/manejarErrores.js';

const app = express();

app.use(express.json());

app.use('/api/proveedores', proveedoresRouter);
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/informes', informesRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/companias-envio', companiasEnvioRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(manejarErrores);

export default app;
