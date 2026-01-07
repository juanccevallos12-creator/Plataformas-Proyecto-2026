-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT DEFAULT 'cliente',
    "permisos" TEXT[] DEFAULT ARRAY['ver']::TEXT[],
    "activo" BOOLEAN DEFAULT true,
    "telefono" TEXT,
    "direccion" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "pais" TEXT,
    "tipo_cliente" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad_id" TEXT,
    "tipo" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "imagen" TEXT,
    "categoria" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT DEFAULT 'pendiente',
    "direccion" TEXT,
    "telefono" TEXT,
    "items" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_items" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "producto_id" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "imagen" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT,
    "cliente_id" TEXT,
    "numero_factura" TEXT,
    "fecha_emision" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2),
    "impuestos" DECIMAL(10,2),
    "total" DECIMAL(10,2),
    "estado" TEXT DEFAULT 'emitida',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "factura_id" TEXT,
    "pedido_id" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,
    "forma_pago_id" TEXT,
    "fecha_pago" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT DEFAULT 'completado',
    "referencia" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT,
    "codigo_postal" TEXT,
    "transportista" TEXT,
    "numero_seguimiento" TEXT,
    "fecha_envio" TIMESTAMP(6),
    "fecha_entrega" TIMESTAMP(6),
    "estado" TEXT DEFAULT 'pendiente',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "descripcion" TEXT,
    "tipo" TEXT,
    "valor" DECIMAL(10,2),
    "porcentaje" DECIMAL(5,2),
    "fecha_inicio" TIMESTAMP(6),
    "fecha_fin" TIMESTAMP(6),
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "producto_id" TEXT,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bodega" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "capacidad" INTEGER,
    "stock_actual" INTEGER DEFAULT 0,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_compra" (
    "id" TEXT NOT NULL,
    "proveedor_id" TEXT,
    "fecha_orden" TIMESTAMP(6),
    "fecha_entrega" TIMESTAMP(6),
    "total" DECIMAL(10,2),
    "estado" TEXT DEFAULT 'pendiente',
    "items" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "producto_id" TEXT,
    "cantidad" INTEGER NOT NULL,
    "bodega_id" TEXT,
    "usuario_id" TEXT,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "pais_id" TEXT,
    "codigo_postal" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "permisos" TEXT[],
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT,
    "descripcion" TEXT,
    "color" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma_pago" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "requiere_autorizacion" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forma_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medidas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT,
    "tipo" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidades_medidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajustes" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT,
    "tipo" TEXT,
    "descripcion" TEXT,
    "categoria" TEXT,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bitacora_operaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "tabla" TEXT,
    "registro_id" TEXT,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bitacora_operaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_data" (
    "id" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generic_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_clientes_email" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE INDEX "idx_productos_categoria" ON "productos"("categoria");

-- CreateIndex
CREATE INDEX "idx_pedidos_usuario" ON "pedidos"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_pedido_items_pedido" ON "pedido_items"("pedido_id");

-- CreateIndex
CREATE INDEX "idx_pedido_items_producto" ON "pedido_items"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "facturas"("numero_factura");

-- CreateIndex
CREATE INDEX "idx_facturas_pedido" ON "facturas"("pedido_id");

-- CreateIndex
CREATE INDEX "idx_pagos_factura" ON "pagos"("factura_id");

-- CreateIndex
CREATE INDEX "idx_envios_pedido" ON "envios"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "descuentos_codigo_key" ON "descuentos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_usuario_id_producto_id_key" ON "carrito"("usuario_id", "producto_id");

-- CreateIndex
CREATE INDEX "idx_movimientos_producto" ON "movimientos"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ajustes_clave_key" ON "ajustes"("clave");

-- CreateIndex
CREATE INDEX "idx_bitacora_fecha" ON "bitacora_operaciones"("fecha");

-- CreateIndex
CREATE INDEX "idx_bitacora_usuario" ON "bitacora_operaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_collection_name" ON "generic_data"("collection_name");

-- CreateIndex
CREATE INDEX "idx_data_gin" ON "generic_data" USING GIN ("data");

-- CreateIndex
CREATE INDEX "idx_generic_collection" ON "generic_data"("collection_name");

-- CreateIndex
CREATE INDEX "idx_generic_data_gin" ON "generic_data" USING GIN ("data");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "fk_pedido" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
