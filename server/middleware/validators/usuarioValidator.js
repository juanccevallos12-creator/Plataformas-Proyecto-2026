// server/middleware/validators/usuarioValidator.js

import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Errores de validación",
      errors: errors.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  
  next();
};

export const validateCrearUsuario = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .escape(),
  
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  
  body('rol')
    .optional()
    .isIn(['admin', 'vendedor', 'cliente']).withMessage('Rol inválido'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{9,15}$/).withMessage('Teléfono inválido'),
  
  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser true o false'),
  
  handleValidationErrors
];

export const validateActualizarUsuario = [
  param('id')
    .notEmpty().withMessage('El ID es requerido')
    .trim(),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .escape(),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  
  body('rol')
    .optional()
    .isIn(['admin', 'vendedor', 'cliente']).withMessage('Rol inválido'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{9,15}$/).withMessage('Teléfono inválido'),
  
  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser true o false'),
  
  handleValidationErrors
];

export const validateUsuarioId = [
  param('id')
    .notEmpty().withMessage('El ID es requerido')
    .trim(),
  
  handleValidationErrors
];