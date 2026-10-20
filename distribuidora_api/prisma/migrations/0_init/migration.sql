-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `numero_telefono` VARCHAR(20) NOT NULL,
    `direccion` VARCHAR(150) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companias_envio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `numero_telefono` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedido_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,

    INDEX `fk_detalle_pedido`(`pedido_id`),
    INDEX `fk_detalle_producto`(`producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `cargo` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `fecha_ingreso` DATE NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_pedido` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cliente_id` INTEGER NOT NULL,
    `empleado_id` INTEGER NOT NULL,
    `compania_envio_id` INTEGER NOT NULL,

    INDEX `fk_pedidos_cliente`(`cliente_id`),
    INDEX `fk_pedidos_compania`(`compania_envio_id`),
    INDEX `fk_pedidos_empleado`(`empleado_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `categoria` VARCHAR(150) NOT NULL,
    `marca` VARCHAR(150) NOT NULL,
    `precio_pesos` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `proveedor_id` INTEGER NOT NULL,

    INDEX `fk_productos_proveedor`(`proveedor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `cuit_empresa` VARCHAR(13) NOT NULL,
    `numero_telefono` VARCHAR(20) NOT NULL,
    `direccion` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `cuit_empresa`(`cuit_empresa`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalle_pedido` ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_pedido` ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_compania` FOREIGN KEY (`compania_envio_id`) REFERENCES `companias_envio`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_empleado` FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_proveedor` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddCheckConstraints (Prisma no las modela, se agregan a mano)
ALTER TABLE `productos` ADD CONSTRAINT `chk_producto_precio` CHECK (`precio_pesos` >= 0);

ALTER TABLE `productos` ADD CONSTRAINT `chk_producto_stock` CHECK (`stock` >= 0);

ALTER TABLE `detalle_pedido` ADD CONSTRAINT `chk_detalle_cantidad` CHECK (`cantidad` > 0);

ALTER TABLE `detalle_pedido` ADD CONSTRAINT `chk_detalle_precio` CHECK (`precio_unitario` >= 0);
