// /client/js/config/collections.js
// Configuración de las 26 colecciones del sistema (agregadas marcas y monedas)

export const COLLECTIONS = {
  // ============================================================
  //                    GENERAL
  // ============================================================
  productos: {
    name: 'Productos',
    nameSingular: 'Producto',
    icon: '📦',
    endpoint: 'productos',
    tableColumns: ['imagen', 'nombre', 'marca', 'categoria', 'precio', 'stock'],
    fields: {
      nombre: {
        label: 'Nombre del Producto',
        type: 'text',
        required: true,
        maxLength: 200,
        placeholder: 'Ej: Laptop Gaming ASUS ROG Strix G15'
      },
      marca: {
        label: 'Marca',
        type: 'dynamic-select',
        required: true,
        endpoint: 'marcas',
        valueField: 'nombre',
        labelField: 'nombre'
      },
      categoria: {
        label: 'Categoría',
        type: 'dynamic-select',
        required: true,
        endpoint: 'categorias',
        valueField: 'nombre',
        labelField: 'nombre'
      },
      precio: {
        label: 'Precio',
        type: 'number',
        required: true,
        min: 0.01,
        step: 0.01,
        placeholder: '0.00'
      },
      moneda: {
        label: 'Moneda',
        type: 'dynamic-select',
        required: true,
        endpoint: 'monedas',
        valueField: 'codigo',
        labelField: 'codigo',
        default: 'USD'
      },
      stock: {
        label: 'Stock Disponible',
        type: 'number',
        required: true,
        min: 0,
        step: 1,
        placeholder: '0'
      },
      imagen: {
        label: 'URL de Imagen Principal',
        type: 'url',
        required: true,
        placeholder: './assets/images/productos/producto.jpg'
      },
      resena: {
        label: 'Reseña Corta',
        type: 'textarea',
        required: true,
        maxLength: 150,
        placeholder: 'Descripción breve (máx 150 caracteres)',
        rows: 2
      },
      descripcion: {
        label: 'Descripción Completa',
        type: 'textarea',
        required: false,
        placeholder: 'Descripción detallada del producto',
        rows: 4
      },
      specs: {
        label: 'Especificaciones',
        type: 'textarea',
        required: false,
        placeholder: 'Una especificación por línea',
        rows: 5,
        help: 'Escribe cada especificación en una línea nueva'
      },
      colores: {
        label: 'Colores (JSON)',
        type: 'textarea',
        required: false,
        placeholder: '[{"color":"Negro","disponible":true}]',
        rows: 3,
        help: 'Formato JSON array'
      },
      imagenes: {
        label: 'Imágenes Adicionales (JSON)',
        type: 'textarea',
        required: false,
        placeholder: '["./assets/images/img1.jpg"]',
        rows: 2
      },
      activo: {
        label: 'Producto Activo',
        type: 'checkbox',
        default: true
      }
    }
  },

  categorias: {
    name: 'Categorías',
    nameSingular: 'Categoría',
    icon: '🏷️',
    endpoint: 'categorias',
    tableColumns: ['nombre', 'descripcion', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true,
        placeholder: 'Laptops, Componentes, etc.'
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        placeholder: 'Descripción de la categoría'
      },
      icono: { 
        label: 'Icono (emoji)', 
        type: 'text',
        placeholder: '💻'
      },
      activo: { 
        label: 'Activa', 
        type: 'checkbox',
        default: true
      }
    }
  },

  marcas: {
    name: 'Marcas',
    nameSingular: 'Marca',
    icon: '🏢',
    endpoint: 'marcas',
    tableColumns: ['nombre', 'descripcion', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre de la Marca', 
        type: 'text', 
        required: true,
        placeholder: 'Ej: Asus, Logitech, etc.'
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        placeholder: 'Información sobre la marca'
      },
      logo: { 
        label: 'URL del Logo', 
        type: 'url',
        placeholder: './assets/images/marcas/logo.png'
      },
      activo: { 
        label: 'Activa', 
        type: 'checkbox',
        default: true
      }
    }
  },

  pedidos: {
    name: 'Pedidos',
    nameSingular: 'Pedido',
    icon: '🛍️',
    endpoint: 'pedidos',
    tableColumns: ['id', 'usuarioId', 'total', 'estado', 'createdAt'],
    fields: {
      usuarioId: { 
        label: 'Usuario ID', 
        type: 'text', 
        required: true 
      },
      total: { 
        label: 'Total', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      estado: { 
        label: 'Estado', 
        type: 'text', 
        required: true,
        placeholder: 'pendiente, procesando, enviado, entregado'
      },
      direccionEnvio: { 
        label: 'Dirección', 
        type: 'textarea',
        rows: 3
      }
    }
  },

  carrito: {
    name: 'Carritos',
    nameSingular: 'Carrito',
    icon: '🛒',
    endpoint: 'carrito',
    tableColumns: ['usuarioId', 'total', 'createdAt'],
    fields: {
      usuarioId: { 
        label: 'Usuario ID', 
        type: 'text', 
        required: true 
      },
      total: { 
        label: 'Total', 
        type: 'number',
        min: 0,
        step: 0.01
      }
    }
  },

  // ============================================================
  //                    VENTAS
  // ============================================================
  facturas: {
    name: 'Facturas',
    nameSingular: 'Factura',
    icon: '📄',
    endpoint: 'facturas',
    tableColumns: ['numero', 'pedidoId', 'total', 'estado', 'createdAt'],
    fields: {
      numero: { 
        label: 'Número', 
        type: 'text', 
        required: true,
        placeholder: 'FAC-001'
      },
      pedidoId: { 
        label: 'Pedido ID', 
        type: 'text', 
        required: true 
      },
      subtotal: { 
        label: 'Subtotal', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      iva: { 
        label: 'IVA', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      total: { 
        label: 'Total', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      estado: { 
        label: 'Estado', 
        type: 'text',
        placeholder: 'emitida, pagada, anulada'
      }
    }
  },

  pagos: {
    name: 'Pagos',
    nameSingular: 'Pago',
    icon: '💳',
    endpoint: 'pagos',
    tableColumns: ['pedidoId', 'monto', 'formaPago', 'estado', 'createdAt'],
    fields: {
      pedidoId: { 
        label: 'Pedido ID', 
        type: 'text', 
        required: true 
      },
      monto: { 
        label: 'Monto', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      formaPago: { 
        label: 'Forma de Pago', 
        type: 'text', 
        required: true,
        placeholder: 'Tarjeta, Efectivo, Transferencia'
      },
      estado: { 
        label: 'Estado', 
        type: 'text', 
        required: true,
        placeholder: 'pendiente, aprobado, rechazado'
      },
      referencia: { 
        label: 'Referencia', 
        type: 'text',
        placeholder: 'Código de transacción'
      }
    }
  },

  envios: {
    name: 'Envíos',
    nameSingular: 'Envío',
    icon: '🚚',
    endpoint: 'envios',
    tableColumns: ['pedidoId', 'estado', 'trackingNumber', 'courier'],
    fields: {
      pedidoId: { 
        label: 'Pedido ID', 
        type: 'text', 
        required: true 
      },
      estado: { 
        label: 'Estado', 
        type: 'text', 
        required: true,
        placeholder: 'preparando, en_transito, entregado'
      },
      trackingNumber: { 
        label: 'Tracking', 
        type: 'text',
        placeholder: 'ABC123456'
      },
      courier: { 
        label: 'Courier', 
        type: 'text',
        placeholder: 'Servientrega, DHL, etc.'
      },
      costoEnvio: { 
        label: 'Costo', 
        type: 'number',
        min: 0,
        step: 0.01
      }
    }
  },

  descuentos: {
    name: 'Descuentos',
    nameSingular: 'Descuento',
    icon: '🎁',
    endpoint: 'descuentos',
    tableColumns: ['codigo', 'tipo', 'valor', 'activo'],
    fields: {
      codigo: { 
        label: 'Código', 
        type: 'text', 
        required: true,
        placeholder: 'VERANO2024'
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        rows: 2
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'porcentaje, monto_fijo'
      },
      valor: { 
        label: 'Valor', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  // ============================================================
  //                    CLIENTES
  // ============================================================
  usuarios: {
    name: 'Usuarios',
    nameSingular: 'Usuario',
    icon: '👥',
    endpoint: 'usuarios',
    tableColumns: ['nombre', 'email', 'rol', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      email: { 
        label: 'Email', 
        type: 'email', 
        required: true 
      },
      rol: { 
        label: 'Rol', 
        type: 'text', 
        required: true,
        placeholder: 'admin, vendedor, cliente'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  clientes: {
    name: 'Clientes',
    nameSingular: 'Cliente',
    icon: '👤',
    endpoint: 'clientes',
    tableColumns: ['usuarioId', 'numeroDocumento', 'telefono'],
    fields: {
      usuarioId: { 
        label: 'Usuario ID', 
        type: 'text', 
        required: true 
      },
      numeroDocumento: { 
        label: 'Documento', 
        type: 'text', 
        required: true,
        placeholder: '1234567890'
      },
      telefono: { 
        label: 'Teléfono', 
        type: 'text',
        placeholder: '+593 99 123 4567'
      }
    }
  },

  contactos: {
    name: 'Mensajes',
    nameSingular: 'Mensaje',
    icon: '📧',
    endpoint: 'contactos',
    tableColumns: ['nombre', 'email', 'asunto', 'estado'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      email: { 
        label: 'Email', 
        type: 'email', 
        required: true 
      },
      asunto: { 
        label: 'Asunto', 
        type: 'text', 
        required: true 
      },
      mensaje: { 
        label: 'Mensaje', 
        type: 'textarea', 
        required: true,
        rows: 5
      },
      estado: { 
        label: 'Estado', 
        type: 'text',
        placeholder: 'nuevo, leido, respondido'
      }
    }
  },

  ubicaciones: {
    name: 'Ubicaciones',
    nameSingular: 'Ubicación',
    icon: '📍',
    endpoint: 'ubicaciones',
    tableColumns: ['nombre', 'tipo', 'ciudad', 'predeterminada'],
    fields: {
      clienteId: { 
        label: 'Cliente ID', 
        type: 'text', 
        required: true 
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'casa, oficina, otro'
      },
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true,
        placeholder: 'Mi Casa'
      },
      direccion: { 
        label: 'Dirección', 
        type: 'textarea', 
        required: true,
        rows: 3,
        placeholder: 'Calle, número, referencias'
      },
      ciudad: { 
        label: 'Ciudad', 
        type: 'text', 
        required: true 
      },
      predeterminada: { 
        label: 'Predeterminada', 
        type: 'checkbox' 
      }
    }
  },

  // ============================================================
  //                    INVENTARIO
  // ============================================================
  bodega: {
    name: 'Bodegas',
    nameSingular: 'Bodega',
    icon: '🏭',
    endpoint: 'bodega',
    tableColumns: ['nombre', 'codigo', 'tipo', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      codigo: { 
        label: 'Código', 
        type: 'text', 
        required: true,
        placeholder: 'BOD-001'
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text',
        placeholder: 'principal, secundaria'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  proveedores: {
    name: 'Proveedores',
    nameSingular: 'Proveedor',
    icon: '🏢',
    endpoint: 'proveedores',
    tableColumns: ['nombre', 'ruc', 'email', 'telefono', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      ruc: { 
        label: 'RUC', 
        type: 'text', 
        required: true,
        placeholder: '1234567890001'
      },
      email: { 
        label: 'Email', 
        type: 'email', 
        required: true 
      },
      telefono: { 
        label: 'Teléfono', 
        type: 'text',
        placeholder: '+593 99 123 4567'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  'ordenes-compra': {
    name: 'Órdenes de Compra',
    nameSingular: 'Orden de Compra',
    icon: '📝',
    endpoint: 'ordenes-compra',
    tableColumns: ['numero', 'proveedorId', 'total', 'estado'],
    fields: {
      numero: { 
        label: 'Número', 
        type: 'text', 
        required: true,
        placeholder: 'OC-001'
      },
      proveedorId: { 
        label: 'Proveedor ID', 
        type: 'text', 
        required: true 
      },
      total: { 
        label: 'Total', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01
      },
      estado: { 
        label: 'Estado', 
        type: 'text', 
        required: true,
        placeholder: 'pendiente, recibida, cancelada'
      }
    }
  },

  movimientos: {
    name: 'Movimientos',
    nameSingular: 'Movimiento',
    icon: '↔️',
    endpoint: 'movimientos',
    tableColumns: ['tipo', 'productoId', 'cantidad', 'createdAt'],
    fields: {
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'entrada, salida, ajuste'
      },
      bodegaId: { 
        label: 'Bodega ID', 
        type: 'text', 
        required: true 
      },
      productoId: { 
        label: 'Producto ID', 
        type: 'text', 
        required: true 
      },
      cantidad: { 
        label: 'Cantidad', 
        type: 'number', 
        required: true,
        step: 1
      },
      motivo: { 
        label: 'Motivo', 
        type: 'textarea',
        rows: 3
      }
    }
  },

  // ============================================================
  //                    GEOGRAFÍA
  // ============================================================
  paises: {
    name: 'Países',
    nameSingular: 'País',
    icon: '🌎',
    endpoint: 'paises',
    tableColumns: ['nombre', 'codigo', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      codigo: { 
        label: 'Código', 
        type: 'text', 
        required: true,
        placeholder: 'EC, US, CO'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  ciudades: {
    name: 'Ciudades',
    nameSingular: 'Ciudad',
    icon: '🏙️',
    endpoint: 'ciudades',
    tableColumns: ['nombre', 'paisId', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      paisId: { 
        label: 'País ID', 
        type: 'text', 
        required: true 
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  // ============================================================
  //                    CONFIGURACIÓN
  // ============================================================
  roles: {
    name: 'Roles',
    nameSingular: 'Rol',
    icon: '🔑',
    endpoint: 'roles',
    tableColumns: ['nombre', 'nivel', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        rows: 2
      },
      nivel: { 
        label: 'Nivel', 
        type: 'number', 
        required: true,
        min: 1,
        step: 1
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  estados: {
    name: 'Estados',
    nameSingular: 'Estado',
    icon: '📊',
    endpoint: 'estados',
    tableColumns: ['nombre', 'tipo', 'codigo', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true 
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'pedido, pago, envio'
      },
      codigo: { 
        label: 'Código', 
        type: 'text', 
        required: true 
      },
      color: { 
        label: 'Color', 
        type: 'text',
        placeholder: '#3b82f6'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  'forma-pago': {
    name: 'Formas de Pago',
    nameSingular: 'Forma de Pago',
    icon: '💰',
    endpoint: 'forma-pago',
    tableColumns: ['nombre', 'tipo', 'comision', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true,
        placeholder: 'Tarjeta de Crédito'
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'tarjeta, efectivo, transferencia'
      },
      comision: { 
        label: 'Comisión (%)', 
        type: 'number',
        min: 0,
        step: 0.01
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  'unidades-medidas': {
    name: 'Unidades de Medida',
    nameSingular: 'Unidad de Medida',
    icon: '📏',
    endpoint: 'unidades-medidas',
    tableColumns: ['nombre', 'simbolo', 'tipo', 'activo'],
    fields: {
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true,
        placeholder: 'Kilogramo, Litro, etc.'
      },
      simbolo: { 
        label: 'Símbolo', 
        type: 'text', 
        required: true,
        placeholder: 'kg, L, etc.'
      },
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'peso, volumen, longitud'
      },
      activo: { 
        label: 'Activo', 
        type: 'checkbox',
        default: true
      }
    }
  },

  monedas: {
    name: 'Monedas',
    nameSingular: 'Moneda',
    icon: '💵',
    endpoint: 'monedas',
    tableColumns: ['codigo', 'nombre', 'simbolo', 'activo'],
    fields: {
      codigo: { 
        label: 'Código', 
        type: 'text', 
        required: true,
        placeholder: 'USD, EUR, etc.',
        maxLength: 3
      },
      nombre: { 
        label: 'Nombre', 
        type: 'text', 
        required: true,
        placeholder: 'Dólar Estadounidense'
      },
      simbolo: { 
        label: 'Símbolo', 
        type: 'text', 
        required: true,
        placeholder: '$',
        maxLength: 3
      },
      activo: { 
        label: 'Activa', 
        type: 'checkbox',
        default: true
      }
    }
  },

  ajustes: {
    name: 'Ajustes del Sistema',
    nameSingular: 'Ajuste',
    icon: '⚙️',
    endpoint: 'ajustes',
    tableColumns: ['clave', 'valor', 'categoria', 'publico'],
    fields: {
      clave: { 
        label: 'Clave', 
        type: 'text', 
        required: true,
        placeholder: 'app.nombre'
      },
      valor: { 
        label: 'Valor', 
        type: 'text', 
        required: true 
      },
      categoria: { 
        label: 'Categoría', 
        type: 'text', 
        required: true,
        placeholder: 'general, seguridad, email'
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        rows: 2
      },
      publico: { 
        label: 'Público', 
        type: 'checkbox' 
      }
    }
  },

  // ============================================================
  //                    SISTEMA
  // ============================================================
  bitacora: {
    name: 'Bitácora',
    nameSingular: 'Registro',
    icon: '📋',
    endpoint: 'bitacora_operaciones',
    tableColumns: ['tipo', 'accion', 'usuario', 'createdAt'],
    fields: {
      tipo: { 
        label: 'Tipo', 
        type: 'text', 
        required: true,
        placeholder: 'sistema, usuario, transaccion'
      },
      accion: { 
        label: 'Acción', 
        type: 'text', 
        required: true,
        placeholder: 'crear, editar, eliminar'
      },
      usuario: { 
        label: 'Usuario', 
        type: 'text', 
        required: true 
      },
      descripcion: { 
        label: 'Descripción', 
        type: 'textarea',
        rows: 3
      }
    }
  }
};

// Organización del menú por secciones
export const MENU_SECTIONS = {
  general: {
    title: 'General',
    collections: ['productos', 'categorias', 'marcas', 'pedidos', 'carrito']
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
    collections: ['roles', 'estados', 'forma-pago', 'unidades-medidas', 'monedas', 'ajustes']
  },
  sistema: {
    title: 'Sistema',
    collections: ['bitacora']
  }
};