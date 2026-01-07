// server/controllers/admin.controller.js
import prisma from '../config/prisma.js';

export const AdminController = {
  
  /**
   * DASHBOARD - Estadísticas generales
   */
  async dashboard(req, res, next) {
    try {
      const [
        totalProductos,
        totalUsuarios,
        totalPedidos,
        pedidosPendientes,
        totalVentas
      ] = await Promise.all([
        prisma.producto.count(),
        prisma.usuario.count(),
        prisma.pedido.count(),
        prisma.pedido.count({ where: { estado: 'pendiente' } }),
        prisma.pedido.aggregate({
          _sum: { total: true },
          where: { estado: { in: ['completado', 'enviado'] } }
        })
      ]);
      
      res.json({
        status: 'success',
        data: {
          productos: totalProductos,
          usuarios: totalUsuarios,
          pedidos: totalPedidos,
          pedidosPendientes,
          ventasTotales: parseFloat(totalVentas._sum.total || 0)
        }
      });
    } catch (err) {
      console.error('Error en dashboard:', err);
      next(err);
    }
  },
  
  /**
   * REPORTES DE VENTAS
   */
  async reporteVentas(req, res, next) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      const where = {};
      
      if (fechaInicio || fechaFin) {
        where.createdAt = {};
        if (fechaInicio) where.createdAt.gte = new Date(fechaInicio);
        if (fechaFin) where.createdAt.lte = new Date(fechaFin);
      }
      
      const ventas = await prisma.pedido.findMany({
        where,
        select: {
          id: true,
          total: true,
          estado: true,
          createdAt: true,
          usuario: {
            select: {
              nombre: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
      
      res.json({
        status: 'success',
        data: {
          ventas,
          total: totalVentas,
          cantidad: ventas.length
        }
      });
    } catch (err) {
      console.error('Error en reporte de ventas:', err);
      next(err);
    }
  },
  
  /**
   * PRODUCTOS MÁS VENDIDOS
   */
  async productosMasVendidos(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Query raw para obtener productos más vendidos
      const productos = await prisma.$queryRaw`
        SELECT 
          p.id,
          p.nombre,
          p.precio,
          COUNT(pi.id) as total_ventas,
          SUM(pi.cantidad) as unidades_vendidas,
          SUM(pi.subtotal) as ingresos_totales
        FROM productos p
        INNER JOIN pedido_items pi ON p.id = pi.producto_id
        GROUP BY p.id, p.nombre, p.precio
        ORDER BY unidades_vendidas DESC
        LIMIT ${limit}
      `;
      
      res.json({
        status: 'success',
        data: productos
      });
    } catch (err) {
      console.error('Error en productos más vendidos:', err);
      next(err);
    }
  },
  
  /**
   * GESTIÓN DE PEDIDOS
   */
  async gestionarPedidos(req, res, next) {
    try {
      const { estado } = req.query;
      
      const where = estado ? { estado } : {};
      
      const pedidos = await prisma.pedido.findMany({
        where,
        include: {
          usuario: {
            select: {
              nombre: true,
              email: true,
              telefono: true
            }
          },
          pedidoItems: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({
        status: 'success',
        data: pedidos
      });
    } catch (err) {
      console.error('Error en gestión de pedidos:', err);
      next(err);
    }
  }
};