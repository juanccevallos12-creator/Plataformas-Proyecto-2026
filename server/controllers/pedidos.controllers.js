// server/controllers/pedidos.controller.js
import prisma from '../config/prisma.js';

export const PedidosController = {
  
  async crear(req, res, next) {
    try {
      const usuarioId = req.user?.id || 'guest';
      const { 
        items,
        shippingInfo,
        deliveryMethod,
        deliveryCost = 0,
        paymentMethod,
        subtotal,
        total
      } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El pedido debe tener al menos un producto'
        });
      }
      
      const pedidoId = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      // CREAR PEDIDO
      await prisma.$executeRaw`
        INSERT INTO pedidos (
          id, usuario_id, total, estado, direccion, telefono, items, created_at, updated_at
        )
        VALUES (
          ${pedidoId},
          ${usuarioId},
          ${parseFloat(total)},
          ${paymentMethod === 'transfer' ? 'pendiente_pago' : 'pendiente'},
          ${deliveryMethod === 'pickup' ? 'RETIRO EN TIENDA' : `${shippingInfo?.address}, ${shippingInfo?.city}`},
          ${shippingInfo?.phone || ''},
          ${JSON.stringify(items)}::jsonb,
          NOW(),
          NOW()
        )
      `;
      
      // CREAR ITEMS DEL PEDIDO
      for (const item of items) {
        const itemId = `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const subtotalItem = parseFloat(item.precio) * parseInt(item.cantidad);
        
        await prisma.$executeRaw`
          INSERT INTO pedido_items (
            id, pedido_id, producto_id, nombre, descripcion,
            precio, cantidad, subtotal, imagen, created_at
          )
          VALUES (
            ${itemId},
            ${pedidoId},
            ${item.productoId || item.id},
            ${item.nombre},
            ${item.descripcion || ''},
            ${parseFloat(item.precio)},
            ${parseInt(item.cantidad)},
            ${subtotalItem},
            ${item.imagen || null},
            NOW()
          )
        `;
      }
      
      res.json({
        status: 'success',
        message: 'Pedido creado exitosamente',
        data: {
          id: pedidoId,
          total: parseFloat(total),
          estado: paymentMethod === 'transfer' ? 'pendiente_pago' : 'pendiente'
        }
      });
      
    } catch (err) {
      console.error('Error al crear pedido:', err);
      next(err);
    }
  },
  
  async listar(req, res, next) {
    try {
      const pedidos = await prisma.$queryRaw`
        SELECT 
          p.*,
          json_agg(
            json_build_object(
              'id', pi.id,
              'nombre', pi.nombre,
              'precio', pi.precio,
              'cantidad', pi.cantidad,
              'subtotal', pi.subtotal,
              'imagen', pi.imagen
            )
          ) as items_detallados
        FROM pedidos p
        LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      
      res.json({
        status: 'success',
        data: pedidos
      });
      
    } catch (err) {
      console.error('Error al listar pedidos:', err);
      next(err);
    }
  },
  
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;
      
      const pedidos = await prisma.$queryRaw`
        SELECT 
          p.*,
          json_agg(
            json_build_object(
              'id', pi.id,
              'nombre', pi.nombre,
              'descripcion', pi.descripcion,
              'precio', pi.precio,
              'cantidad', pi.cantidad,
              'subtotal', pi.subtotal,
              'imagen', pi.imagen
            )
          ) as items_detallados
        FROM pedidos p
        LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
        WHERE p.id = ${id}
        GROUP BY p.id
      `;
      
      if (pedidos.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido no encontrado'
        });
      }
      
      res.json({
        status: 'success',
        data: pedidos[0]
      });
      
    } catch (err) {
      console.error('Error:', err);
      next(err);
    }
  },
  
  async obtenerPorUsuario(req, res, next) {
    try {
      const usuarioId = req.user.id;
      
      const pedidos = await prisma.$queryRaw`
        SELECT 
          p.*,
          json_agg(
            json_build_object(
              'id', pi.id,
              'nombre', pi.nombre,
              'precio', pi.precio,
              'cantidad', pi.cantidad,
              'subtotal', pi.subtotal,
              'imagen', pi.imagen
            )
          ) as items_detallados
        FROM pedidos p
        LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
        WHERE p.usuario_id = ${usuarioId}
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      
      res.json({
        status: 'success',
        data: pedidos
      });
      
    } catch (err) {
      console.error('Error:', err);
      next(err);
    }
  },
  
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      await prisma.$executeRaw`
        UPDATE pedidos 
        SET estado = ${estado}, updated_at = NOW()
        WHERE id = ${id}
      `;
      
      res.json({
        status: 'success',
        message: 'Pedido actualizado'
      });
      
    } catch (err) {
      console.error('Error:', err);
      next(err);
    }
  },
  
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      
      await prisma.$executeRaw`
        DELETE FROM pedidos WHERE id = ${id}
      `;
      
      res.json({
        status: 'success',
        message: 'Pedido eliminado'
      });
      
    } catch (err) {
      console.error('Error:', err);
      next(err);
    }
  },
  
  async buscarPorId(req, res, next) {
    return this.obtenerPorId(req, res, next);
  }
};