// server/controllers/generic.controllers.js
import prisma from '../config/prisma.js';

export function createGenericController(modelName) {
  const prismaModel = prisma[modelName];
  
  if (!prismaModel) {
    console.warn(`⚠️  Modelo Prisma no encontrado: ${modelName}`);
  }
  
  return {
    async listar(req, res, next) {
      try {
        if (!prismaModel) {
          return res.status(404).json({
            status: 'error',
            message: `Modelo ${modelName} no implementado`
          });
        }
        
        // ✅ NUEVO: Construir filtros desde query params
        const where = {};
        const queryParams = req.query;
        
        // Filtrar parámetros válidos (excluir paginación, ordenamiento, etc.)
        const excludedParams = ['page', 'limit', 'sort', 'order'];
        
        for (const [key, value] of Object.entries(queryParams)) {
          if (!excludedParams.includes(key) && value !== undefined && value !== '') {
            // Si el valor es 'true' o 'false', convertir a booleano
            if (value === 'true') {
              where[key] = true;
            } else if (value === 'false') {
              where[key] = false;
            } else {
              where[key] = value;
            }
          }
        }
        
        const items = await prismaModel.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        });
        
        res.json({
          status: 'success',
          data: items
        });
      } catch (err) {
        console.error(`Error al listar ${modelName}:`, err);
        next(err);
      }
    },
    
    async buscarPorId(req, res, next) {
      try {
        if (!prismaModel) {
          return res.status(404).json({
            status: 'error',
            message: `Modelo ${modelName} no implementado`
          });
        }
        
        const { id } = req.params;
        const item = await prismaModel.findUnique({
          where: { id }
        });
        
        if (!item) {
          return res.status(404).json({
            status: 'error',
            message: 'Registro no encontrado'
          });
        }
        
        res.json({
          status: 'success',
          data: item
        });
      } catch (err) {
        console.error(`Error al buscar ${modelName}:`, err);
        next(err);
      }
    },
    
    async crear(req, res, next) {
      try {
        if (!prismaModel) {
          return res.status(404).json({
            status: 'error',
            message: `Modelo ${modelName} no implementado`
          });
        }
        
        const nuevoItem = await prismaModel.create({
          data: req.body
        });
        
        res.status(201).json({
          status: 'success',
          message: 'Creado exitosamente',
          data: nuevoItem
        });
      } catch (err) {
        console.error(`Error al crear ${modelName}:`, err);
        next(err);
      }
    },
    
    async actualizar(req, res, next) {
      try {
        if (!prismaModel) {
          return res.status(404).json({
            status: 'error',
            message: `Modelo ${modelName} no implementado`
          });
        }
        
        const { id } = req.params;
        const itemActualizado = await prismaModel.update({
          where: { id },
          data: req.body
        });
        
        res.json({
          status: 'success',
          message: 'Actualizado exitosamente',
          data: itemActualizado
        });
      } catch (err) {
        console.error(`Error al actualizar ${modelName}:`, err);
        next(err);
      }
    },
    
    async eliminar(req, res, next) {
      try {
        if (!prismaModel) {
          return res.status(404).json({
            status: 'error',
            message: `Modelo ${modelName} no implementado`
          });
        }
        
        const { id } = req.params;
        await prismaModel.delete({
          where: { id }
        });
        
        res.json({
          status: 'success',
          message: 'Eliminado exitosamente'
        });
      } catch (err) {
        console.error(`Error al eliminar ${modelName}:`, err);
        next(err);
      }
    }
  };
}

// Exportar controladores
export const CategoriasController = createGenericController('categoria');
export const ClientesController = createGenericController('cliente');
export const UbicacionesController = createGenericController('ubicacion');
export const FacturasController = createGenericController('factura');
export const PagosGenericController = createGenericController('pago');
export const EnviosGenericController = createGenericController('envio');
export const DescuentosController = createGenericController('descuento');
export const BodegaController = createGenericController('bodega');
export const ProveedoresController = createGenericController('proveedor');
export const OrdenesCompraController = createGenericController('ordenCompra');
export const MovimientosController = createGenericController('movimiento');
export const PaisesController = createGenericController('pais');
export const CiudadesController = createGenericController('ciudad');
export const RolesController = createGenericController('rol');
export const EstadosController = createGenericController('estado');
export const FormaPagoController = createGenericController('formaPago');
export const UnidadesMedidasController = createGenericController('unidadMedida');
export const AjustesController = createGenericController('ajuste');
export const ContactosController = createGenericController('contacto');
export const BitacoraController = createGenericController('bitacora_operaciones');