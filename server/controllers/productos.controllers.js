// server/controllers/productos.controller.js
import prisma from '../config/prisma.js';

export const ProductosController = {
  
  async listar(req, res, next) {
    try {
      const productos = await prisma.producto.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      const productosFormateados = productos.map(p => ({
        ...p,
        id: p.id,
        precio: parseFloat(p.precio)
      }));
      
      res.json({
        status: "success",
        data: productosFormateados
      });
    } catch (err) {
      console.error("Error en listar productos:", err);
      next(err);
    }
  },
  
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await prisma.producto.findUnique({
        where: { id }
      });

      if (!producto) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado"
        });
      }

      res.json({
        status: "success",
        data: {
          ...producto,
          precio: parseFloat(producto.precio)
        }
      });
    } catch (err) {
      console.error("Error en buscarPorId:", err);
      next(err);
    }
  },
  
  async crear(req, res, next) {
    try {
      const nuevoProducto = await prisma.producto.create({
        data: {
          ...req.body,
          precio: parseFloat(req.body.precio)
        }
      });

      res.status(201).json({
        status: "success",
        message: "Producto creado exitosamente",
        data: nuevoProducto
      });
    } catch (err) {
      console.error("Error en crear producto:", err);
      next(err);
    }
  },
  
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const productoActualizado = await prisma.producto.update({
        where: { id },
        data: {
          ...req.body,
          precio: req.body.precio ? parseFloat(req.body.precio) : undefined
        }
      });

      res.json({
        status: "success",
        message: "Producto actualizado exitosamente",
        data: productoActualizado
      });
    } catch (err) {
      console.error("Error en actualizar producto:", err);
      next(err);
    }
  },
  
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      await prisma.producto.delete({
        where: { id }
      });

      res.json({
        status: "success",
        message: "Producto eliminado exitosamente"
      });
    } catch (err) {
      console.error("Error en eliminar producto:", err);
      next(err);
    }
  },
  
  async buscar(req, res, next) {
    try {
      const { q, categoria, marca, minPrecio, maxPrecio } = req.query;
      
      const where = {};
      
      if (q) {
        where.OR = [
          { nombre: { contains: q, mode: 'insensitive' } },
          { descripcion: { contains: q, mode: 'insensitive' } }
        ];
      }
      
      if (categoria) where.categoria = categoria;
      if (marca) where.marca = marca;
      
      if (minPrecio || maxPrecio) {
        where.precio = {};
        if (minPrecio) where.precio.gte = parseFloat(minPrecio);
        if (maxPrecio) where.precio.lte = parseFloat(maxPrecio);
      }
      
      const productos = await prisma.producto.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        status: "success",
        data: productos.map(p => ({
          ...p,
          precio: parseFloat(p.precio)
        })),
        count: productos.length
      });
    } catch (err) {
      console.error("Error en búsqueda:", err);
      next(err);
    }
  }
};