// server/controllers/carrito.controllers.js
import prisma from '../config/prisma.js';

export const CarritoController = {
  
  async obtenerCarrito(req, res, next) {
    try {
      const usuarioId = req.user.id;
      
      const items = await prisma.carrito.findMany({
        where: { usuarioId },
      include: {
            productos: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
                stock: true
              }
            }
          }
        });
      
      res.json({
        status: 'success',
        data: items
      });
    } catch (err) {
      console.error('Error al obtener carrito:', err);
      next(err);
    }
  },
  
  async agregarItem(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { productoId, cantidad = 1 } = req.body;
      
      if (!productoId) {
        return res.status(400).json({
          status: 'error',
          message: 'ProductoId es requerido'
        });
      }
      
      // Verificar que el producto existe
      const producto = await prisma.producto.findUnique({
        where: { id: productoId }
      });
      
      if (!producto) {
        return res.status(404).json({
          status: 'error',
          message: 'Producto no encontrado'
        });
      }
      
      // Verificar si ya existe en el carrito
      const itemExistente = await prisma.carrito.findUnique({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId
          }
        }
      });
      
      let item;
      
      if (itemExistente) {
        // Actualizar cantidad
        item = await prisma.carrito.update({
          where: {
            usuarioId_productoId: {
              usuarioId,
              productoId
            }
          },
          data: {
            cantidad: itemExistente.cantidad + cantidad
          }
        });
      } else {
        // Crear nuevo item
        item = await prisma.carrito.create({
          data: {
            usuarioId,
            productoId,
            cantidad
          }
        });
      }
      
      res.json({
        status: 'success',
        message: 'Producto agregado al carrito',
        data: item
      });
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      next(err);
    }
  },
  
  async actualizarCantidad(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { productoId, cantidad } = req.body;
      
      if (!productoId || !cantidad || cantidad < 1) {
        return res.status(400).json({
          status: 'error',
          message: 'ProductoId y cantidad válida son requeridos'
        });
      }
      
      const item = await prisma.carrito.update({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId
          }
        },
        data: { cantidad }
      });
      
      res.json({
        status: 'success',
        message: 'Cantidad actualizada',
        data: item
      });
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Item no encontrado en el carrito'
        });
      }
      
      next(err);
    }
  },
  
  async eliminarItem(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { productoId } = req.params;
      
      await prisma.carrito.delete({
        where: {
          usuarioId_productoId: {
            usuarioId,
            productoId
          }
        }
      });
      
      res.json({
        status: 'success',
        message: 'Producto eliminado del carrito'
      });
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Item no encontrado en el carrito'
        });
      }
      
      next(err);
    }
  },
  
  async vaciarCarrito(req, res, next) {
    try {
      const usuarioId = req.user.id;
      
      await prisma.carrito.deleteMany({
        where: { usuarioId }
      });
      
      res.json({
        status: 'success',
        message: 'Carrito vaciado'
      });
    } catch (err) {
      console.error('Error al vaciar carrito:', err);
      next(err);
    }
  }
};