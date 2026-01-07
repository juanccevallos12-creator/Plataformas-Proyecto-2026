// server/controllers/usuarios.controllers.js
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const UsuariosController = {
  
  async listar(req, res, next) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          telefono: true,
          direccion: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({
        status: 'success',
        data: usuarios
      });
    } catch (err) {
      console.error('Error al listar usuarios:', err);
      next(err);
    }
  },
  
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          telefono: true,
          direccion: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!usuario) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      res.json({
        status: 'success',
        data: usuario
      });
    } catch (err) {
      console.error('Error al buscar usuario:', err);
      next(err);
    }
  },
  
  async crear(req, res, next) {
    try {
      const { nombre, email, password, rol, telefono, direccion } = req.body;
      
      if (!nombre || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Nombre, email y contraseña son requeridos'
        });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          rol: rol || 'cliente',
          telefono,
          direccion
        }
      });
      
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;
      
      res.status(201).json({
        status: 'success',
        message: 'Usuario creado exitosamente',
        data: usuarioSinPassword
      });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      
      if (err.code === 'P2002') {
        return res.status(409).json({
          status: 'error',
          message: 'El email ya está registrado'
        });
      }
      
      next(err);
    }
  },
  
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, email, telefono, direccion, rol } = req.body;
      
      const dataToUpdate = {};
      if (nombre) dataToUpdate.nombre = nombre;
      if (email) dataToUpdate.email = email;
      if (telefono !== undefined) dataToUpdate.telefono = telefono;
      if (direccion !== undefined) dataToUpdate.direccion = direccion;
      if (rol) dataToUpdate.rol = rol;
      
      const usuarioActualizado = await prisma.usuario.update({
        where: { id },
        data: dataToUpdate,
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          telefono: true,
          direccion: true,
          updatedAt: true
        }
      });
      
      res.json({
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        data: usuarioActualizado
      });
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      next(err);
    }
  },
  
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      
      await prisma.usuario.delete({
        where: { id }
      });
      
      res.json({
        status: 'success',
        message: 'Usuario eliminado exitosamente'
      });
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      next(err);
    }
  }
};