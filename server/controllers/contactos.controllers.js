// server/controllers/contactos.controllers.js
import prisma from '../config/prisma.js';

export const ContactosController = {
  
  async listar(req, res, next) {
    try {
      const { estado } = req.query;
      
      const where = estado ? { estado } : {};
      
      const contactos = await prisma.contacto.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({
        status: 'success',
        data: contactos
      });
    } catch (err) {
      console.error('Error al listar contactos:', err);
      next(err);
    }
  },
  
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      
      const contacto = await prisma.contacto.findUnique({
        where: { id }
      });
      
      if (!contacto) {
        return res.status(404).json({
          status: 'error',
          message: 'Contacto no encontrado'
        });
      }
      
      res.json({
        status: 'success',
        data: contacto
      });
    } catch (err) {
      console.error('Error al buscar contacto:', err);
      next(err);
    }
  },
  
  async crear(req, res, next) {
    try {
      const { nombre, email, telefono, asunto, mensaje } = req.body;
      
      if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({
          status: 'error',
          message: 'Nombre, email, asunto y mensaje son requeridos'
        });
      }
      
      const nuevoContacto = await prisma.contacto.create({
        data: {
          nombre,
          email,
          telefono,
          asunto,
          mensaje,
          estado: 'pendiente'
        }
      });
      
      res.status(201).json({
        status: 'success',
        message: 'Mensaje enviado exitosamente',
        data: nuevoContacto
      });
    } catch (err) {
      console.error('Error al crear contacto:', err);
      next(err);
    }
  },
  
  async actualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      if (!['pendiente', 'respondido', 'archivado'].includes(estado)) {
        return res.status(400).json({
          status: 'error',
          message: 'Estado inválido'
        });
      }
      
      const contactoActualizado = await prisma.contacto.update({
        where: { id },
        data: { estado }
      });
      
      res.json({
        status: 'success',
        message: 'Estado actualizado',
        data: contactoActualizado
      });
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Contacto no encontrado'
        });
      }
      
      next(err);
    }
  },
  
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      
      await prisma.contacto.delete({
        where: { id }
      });
      
      res.json({
        status: 'success',
        message: 'Contacto eliminado'
      });
    } catch (err) {
      console.error('Error al eliminar contacto:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Contacto no encontrado'
        });
      }
      
      next(err);
    }
  }
};