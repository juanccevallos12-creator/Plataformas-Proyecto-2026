// server/controllers/auth.controllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const AuthController = {
  
  /**
   * REGISTRO DE USUARIO
   */
  async register(req, res, next) {
    try {
      const { nombre, email, password, telefono, direccion } = req.body;
      
      // Validaciones
      if (!nombre || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Nombre, email y contraseña son requeridos'
        });
      }
      
      // Verificar si el email ya existe
      const existingUser = await prisma.usuario.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'El email ya está registrado'
        });
      }
      
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear usuario
      const newUser = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          telefono: telefono || null,
          direccion: direccion || null,
          rol: 'cliente'
        }
      });
      
      // Generar token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, rol: newUser.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            rol: newUser.rol
          },
          token
        }
      });
      
    } catch (err) {
      console.error('Error en registro:', err);
      next(err);
    }
  },
  
  /**
   * LOGIN DE USUARIO
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      console.log('🔐 Intento de login:', email); // DEBUG
      
      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email y contraseña son requeridos'
        });
      }
      
      // Buscar usuario
      const user = await prisma.usuario.findUnique({
        where: { email }
      });
      
      if (!user) {
        console.log('❌ Usuario no encontrado:', email); // DEBUG
        return res.status(401).json({
          status: 'error',
          message: 'Credenciales inválidas'
        });
      }
      
      console.log('✅ Usuario encontrado:', user.email, 'Rol:', user.rol); // DEBUG
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('❌ Contraseña incorrecta para:', email); // DEBUG
        return res.status(401).json({
          status: 'error',
          message: 'Credenciales inválidas'
        });
      }
      
      console.log('✅ Contraseña válida'); // DEBUG
      
      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('✅ Token generado'); // DEBUG
      
      // ✅ ESTRUCTURA CORRECTA DE RESPUESTA
      res.json({
        status: 'success',
        message: 'Login exitoso',
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            telefono: user.telefono,
            direccion: user.direccion
          },
          token
        }
      });
      
      console.log('✅ Respuesta enviada al cliente'); // DEBUG
      
    } catch (err) {
      console.error('❌ Error en login:', err);
      next(err);
    }
  },
  
  /**
   * OBTENER PERFIL DEL USUARIO ACTUAL
   */
  async me(req, res, next) {
    try {
      const userId = req.user.id;
      
      const user = await prisma.usuario.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          telefono: true,
          direccion: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }
      
      res.json({
        status: 'success',
        data: user
      });
      
    } catch (err) {
      console.error('Error en me:', err);
      next(err);
    }
  },
  
  /**
   * CAMBIAR CONTRASEÑA
   */
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Validaciones
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Contraseña actual y nueva son requeridas'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          status: 'error',
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }
      
      // Buscar usuario
      const user = await prisma.usuario.findUnique({
        where: { id: userId }
      });
      
      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Contraseña actual incorrecta'
        });
      }
      
      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Actualizar contraseña
      await prisma.usuario.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
      
      res.json({
        status: 'success',
        message: 'Contraseña actualizada exitosamente'
      });
      
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      next(err);
    }
  }
};