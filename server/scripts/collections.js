// /client/js/config/collections.js
// Configuración de las 24 colecciones del sistema

export const COLLECTIONS = {
  // ============================================================
  //                    GENERAL
  // ============================================================
  productos: {
    name: 'Productos',
    icon: '📦',
    endpoint: 'productos',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      marca: { label: 'Marca', type: 'text', required: true },
      categoria: { label: 'Categoría', type: 'text', required: true },
      precio: { label: 'Precio', type: 'number', required: true },
      stock: { label: 'Stock', type: 'number', required: true },
      imagen: { label: 'Imagen URL', type: 'text' },
      resena: { label: 'Descripción', type: 'textarea' }
    },
    tableColumns: ['imagen', 'nombre', 'categoria', 'marca', 'precio', 'stock']
  },

  categorias: {
    name: 'Categorías',
    icon: '🏷️',
    endpoint: 'categorias',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      descripcion: { label: 'Descripción', type: 'textarea' },
      slug: { label: 'Slug', type: 'text', required: true },
      orden: { label: 'Orden', type: 'number' },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'slug', 'orden', 'activo']
  },

  pedidos: {
    name: 'Pedidos',
    icon: '🛍️',
    endpoint: 'pedidos',
    fields: {
      usuarioId: { label: 'Usuario ID', type: 'text', required: true },
      total: { label: 'Total', type: 'number', required: true },
      estado: { label: 'Estado', type: 'text', required: true },
      direccionEnvio: { label: 'Dirección', type: 'textarea' }
    },
    tableColumns: ['id', 'usuarioId', 'total', 'estado', 'fecha']
  },

  carrito: {
    name: 'Carritos',
    icon: '🛒',
    endpoint: 'carrito',
    fields: {
      usuarioId: { label: 'Usuario ID', type: 'text', required: true },
      total: { label: 'Total', type: 'number' }
    },
    tableColumns: ['usuarioId', 'total', 'items']
  },

  // ============================================================
  //                    VENTAS
  // ============================================================
  facturas: {
    name: 'Facturas',
    icon: '📄',
    endpoint: 'facturas',
    fields: {
      numero: { label: 'Número', type: 'text', required: true },
      pedidoId: { label: 'Pedido ID', type: 'text', required: true },
      subtotal: { label: 'Subtotal', type: 'number', required: true },
      iva: { label: 'IVA', type: 'number', required: true },
      total: { label: 'Total', type: 'number', required: true },
      estado: { label: 'Estado', type: 'text' }
    },
    tableColumns: ['numero', 'pedidoId', 'total', 'estado', 'fecha']
  },

  pagos: {
    name: 'Pagos',
    icon: '💳',
    endpoint: 'pagos',
    fields: {
      pedidoId: { label: 'Pedido ID', type: 'text', required: true },
      monto: { label: 'Monto', type: 'number', required: true },
      formaPago: { label: 'Forma de Pago', type: 'text', required: true },
      estado: { label: 'Estado', type: 'text', required: true },
      referencia: { label: 'Referencia', type: 'text' }
    },
    tableColumns: ['pedidoId', 'monto', 'formaPago', 'estado', 'fecha']
  },

  envios: {
    name: 'Envíos',
    icon: '🚚',
    endpoint: 'envios',
    fields: {
      pedidoId: { label: 'Pedido ID', type: 'text', required: true },
      estado: { label: 'Estado', type: 'text', required: true },
      trackingNumber: { label: 'Tracking', type: 'text' },
      courier: { label: 'Courier', type: 'text' },
      costoEnvio: { label: 'Costo', type: 'number' }
    },
    tableColumns: ['pedidoId', 'estado', 'trackingNumber', 'courier']
  },

  descuentos: {
    name: 'Descuentos',
    icon: '🎁',
    endpoint: 'descuentos',
    fields: {
      codigo: { label: 'Código', type: 'text', required: true },
      descripcion: { label: 'Descripción', type: 'textarea' },
      tipo: { label: 'Tipo', type: 'text', required: true },
      valor: { label: 'Valor', type: 'number', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['codigo', 'tipo', 'valor', 'activo']
  },

  // ============================================================
  //                    CLIENTES
  // ============================================================
  usuarios: {
    name: 'Usuarios',
    icon: '👥',
    endpoint: 'usuarios',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      email: { label: 'Email', type: 'email', required: true },
      rol: { label: 'Rol', type: 'text', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'email', 'rol', 'activo']
  },

  clientes: {
    name: 'Clientes',
    icon: '👤',
    endpoint: 'clientes',
    fields: {
      usuarioId: { label: 'Usuario ID', type: 'text', required: true },
      numeroDocumento: { label: 'Documento', type: 'text', required: true },
      telefono: { label: 'Teléfono', type: 'text' }
    },
    tableColumns: ['usuarioId', 'numeroDocumento', 'telefono']
  },

  contactos: {
    name: 'Mensajes',
    icon: '📧',
    endpoint: 'contactos',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      email: { label: 'Email', type: 'email', required: true },
      asunto: { label: 'Asunto', type: 'text', required: true },
      mensaje: { label: 'Mensaje', type: 'textarea', required: true },
      estado: { label: 'Estado', type: 'text' }
    },
    tableColumns: ['nombre', 'email', 'asunto', 'estado']
  },

  ubicaciones: {
    name: 'Ubicaciones',
    icon: '📍',
    endpoint: 'ubicaciones',
    fields: {
      clienteId: { label: 'Cliente ID', type: 'text', required: true },
      tipo: { label: 'Tipo', type: 'text', required: true },
      nombre: { label: 'Nombre', type: 'text', required: true },
      direccion: { label: 'Dirección', type: 'textarea', required: true },
      ciudad: { label: 'Ciudad', type: 'text', required: true },
      predeterminada: { label: 'Predeterminada', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'tipo', 'ciudad', 'predeterminada']
  },

  // ============================================================
  //                    INVENTARIO
  // ============================================================
  bodega: {
    name: 'Bodegas',
    icon: '🏭',
    endpoint: 'bodega',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      codigo: { label: 'Código', type: 'text', required: true },
      tipo: { label: 'Tipo', type: 'text' },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'codigo', 'tipo', 'activo']
  },

  proveedores: {
    name: 'Proveedores',
    icon: '🏢',
    endpoint: 'proveedores',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      ruc: { label: 'RUC', type: 'text', required: true },
      email: { label: 'Email', type: 'email', required: true },
      telefono: { label: 'Teléfono', type: 'text' },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'ruc', 'email', 'telefono', 'activo']
  },

  'ordenes-compra': {
    name: 'Órdenes de Compra',
    icon: '📝',
    endpoint: 'ordenes-compra',
    fields: {
      numero: { label: 'Número', type: 'text', required: true },
      proveedorId: { label: 'Proveedor ID', type: 'text', required: true },
      total: { label: 'Total', type: 'number', required: true },
      estado: { label: 'Estado', type: 'text', required: true }
    },
    tableColumns: ['numero', 'proveedorId', 'total', 'estado']
  },

  movimientos: {
    name: 'Movimientos',
    icon: '↔️',
    endpoint: 'movimientos',
    fields: {
      tipo: { label: 'Tipo', type: 'text', required: true },
      bodegaId: { label: 'Bodega ID', type: 'text', required: true },
      productoId: { label: 'Producto ID', type: 'text', required: true },
      cantidad: { label: 'Cantidad', type: 'number', required: true },
      motivo: { label: 'Motivo', type: 'textarea' }
    },
    tableColumns: ['tipo', 'productoId', 'cantidad', 'fecha']
  },

  // ============================================================
  //                    GEOGRAFÍA
  // ============================================================
  paises: {
    name: 'Países',
    icon: '🌎',
    endpoint: 'paises',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      codigo: { label: 'Código', type: 'text', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'codigo', 'activo']
  },

  ciudades: {
    name: 'Ciudades',
    icon: '🏙️',
    endpoint: 'ciudades',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      paisId: { label: 'País ID', type: 'text', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'paisId', 'activo']
  },

  // ============================================================
  //                    CONFIGURACIÓN
  // ============================================================
  roles: {
    name: 'Roles',
    icon: '🔑',
    endpoint: 'roles',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      descripcion: { label: 'Descripción', type: 'textarea' },
      nivel: { label: 'Nivel', type: 'number', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'nivel', 'activo']
  },

  estados: {
    name: 'Estados',
    icon: '📊',
    endpoint: 'estados',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      tipo: { label: 'Tipo', type: 'text', required: true },
      codigo: { label: 'Código', type: 'text', required: true },
      color: { label: 'Color', type: 'text' },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'tipo', 'codigo', 'activo']
  },

  'forma-pago': {
    name: 'Formas de Pago',
    icon: '💰',
    endpoint: 'forma-pago',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      tipo: { label: 'Tipo', type: 'text', required: true },
      comision: { label: 'Comisión (%)', type: 'number' },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'tipo', 'comision', 'activo']
  },

  'unidades-medidas': {
    name: 'Unidades de Medida',
    icon: '📏',
    endpoint: 'unidades-medidas',
    fields: {
      nombre: { label: 'Nombre', type: 'text', required: true },
      simbolo: { label: 'Símbolo', type: 'text', required: true },
      tipo: { label: 'Tipo', type: 'text', required: true },
      activo: { label: 'Activo', type: 'checkbox' }
    },
    tableColumns: ['nombre', 'simbolo', 'tipo', 'activo']
  },

  ajustes: {
    name: 'Ajustes del Sistema',
    icon: '⚙️',
    endpoint: 'ajustes',
    fields: {
      clave: { label: 'Clave', type: 'text', required: true },
      valor: { label: 'Valor', type: 'text', required: true },
      categoria: { label: 'Categoría', type: 'text', required: true },
      descripcion: { label: 'Descripción', type: 'textarea' },
      publico: { label: 'Público', type: 'checkbox' }
    },
    tableColumns: ['clave', 'valor', 'categoria', 'publico']
  },

  // ============================================================
  //                    SISTEMA
  // ============================================================
  bitacora: {
    name: 'Bitácora',
    icon: '📋',
    endpoint: 'bitacora',
    fields: {
      tipo: { label: 'Tipo', type: 'text', required: true },
      accion: { label: 'Acción', type: 'text', required: true },
      usuario: { label: 'Usuario', type: 'text', required: true },
      descripcion: { label: 'Descripción', type: 'textarea' }
    },
    tableColumns: ['tipo', 'accion', 'usuario', 'fecha']
  }
};

// Organización del menú por secciones
export const MENU_SECTIONS = {
  general: {
    title: 'General',
    collections: ['productos', 'categorias', 'pedidos', 'carrito']
  },
  ventas: {
    title: 'Ventas',
    collections: ['facturas', 'pagos', 'envios', 'descuentos']
  },
  clientes: {
    title: 'Clientes',
    collections: ['usuarios', 'clientes', 'contactos', 'ubicaciones']
  },
  inventario: {
    title: 'Inventario',
    collections: ['bodega', 'proveedores', 'ordenes-compra', 'movimientos']
  },
  geografia: {
    title: 'Geografía',
    collections: ['paises', 'ciudades']
  },
  configuracion: {
    title: 'Configuración',
    collections: ['roles', 'estados', 'forma-pago', 'unidades-medidas', 'ajustes']
  },
  sistema: {
    title: 'Sistema',
    collections: ['bitacora']
  }
};
