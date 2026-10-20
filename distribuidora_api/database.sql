DROP DATABASE IF EXISTS distribuidora;
CREATE DATABASE distribuidora;
USE distribuidora;

CREATE TABLE proveedores(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  cuit_empresa VARCHAR(13) NOT NULL UNIQUE,
  numero_telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE empleados(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  fecha_ingreso DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE clientes(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  numero_telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(150) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE companias_envio(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  numero_telefono VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE productos(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(150) NOT NULL,
  marca VARCHAR(150) NOT NULL,
  precio_pesos DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  proveedor_id INT NOT NULL,
  CONSTRAINT fk_productos_proveedor
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
    ON DELETE RESTRICT,
  CONSTRAINT chk_producto_precio CHECK (precio_pesos >= 0),
  CONSTRAINT chk_producto_stock CHECK (stock >= 0)
) ENGINE=InnoDB;

CREATE TABLE pedidos(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cliente_id INT NOT NULL,
  empleado_id INT NOT NULL,
  compania_envio_id INT NOT NULL,
  CONSTRAINT fk_pedidos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_empleado
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_compania
    FOREIGN KEY (compania_envio_id) REFERENCES companias_envio(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE detalle_pedido(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE RESTRICT,
  CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0)
) ENGINE=InnoDB;

INSERT INTO proveedores (nombre, cuit_empresa, numero_telefono, direccion, email) VALUES
('Proveedor 1', '30-11111111-1', '1111111111', 'Calle 1 100', 'proveedor1@mail.com'),
('Proveedor 2', '30-22222222-2', '2222222222', 'Calle 2 200', 'proveedor2@mail.com'),
('Proveedor 3', '30-33333333-3', '3333333333', 'Calle 3 300', 'proveedor3@mail.com');

INSERT INTO empleados (nombre, apellido, cargo, email, fecha_ingreso) VALUES
('Juan', 'Perez', 'Vendedor', 'juan.perez@mail.com', '2022-03-15'),
('Maria', 'Gomez', 'Encargado', 'maria.gomez@mail.com', '2020-08-01');

INSERT INTO clientes (nombre, numero_telefono, direccion, ciudad, email) VALUES
('Cliente 1', '4444444441', 'Avenida 1 100', 'Ciudad A', 'cliente1@mail.com'),
('Cliente 2', '4444444442', 'Avenida 2 200', 'Ciudad B', 'cliente2@mail.com'),
('Cliente 3', '4444444443', 'Avenida 3 300', 'Ciudad A', 'cliente3@mail.com');

INSERT INTO companias_envio (nombre, numero_telefono) VALUES
('Compania de envio 1', '5555555551'),
('Compania de envio 2', '5555555552');

INSERT INTO productos (nombre, categoria, marca, precio_pesos, stock, proveedor_id) VALUES
('Producto 1', 'Categoria A', 'Marca 1', 1000.00, 100, 1),
('Producto 2', 'Categoria A', 'Marca 1', 1500.00, 100, 1),
('Producto 3', 'Categoria B', 'Marca 2', 2000.00, 100, 2),
('Producto 4', 'Categoria B', 'Marca 2', 2500.00, 100, 2),
('Producto 5', 'Categoria C', 'Marca 3', 3000.00, 100, 3),
('Producto 6', 'Categoria C', 'Marca 3', 3500.00, 100, 3),
('Producto 7', 'Categoria C', 'Marca 3', 4000.00, 100, 3);

INSERT INTO pedidos (fecha_pedido, cliente_id, empleado_id, compania_envio_id) VALUES
('2026-09-01 10:00:00', 1, 1, 1),
('2026-09-03 11:00:00', 2, 2, 2),
('2026-09-10 12:00:00', 1, 2, 1),
('2026-09-12 13:00:00', 3, 1, 2);

INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 10, 1000.00),
(1, 3, 5, 2000.00),
(2, 5, 8, 3000.00),
(2, 6, 4, 3500.00),
(2, 7, 2, 4000.00),
(3, 2, 6, 1500.00),
(3, 4, 3, 2500.00),
(4, 3, 7, 2000.00),
(4, 5, 5, 3000.00);
