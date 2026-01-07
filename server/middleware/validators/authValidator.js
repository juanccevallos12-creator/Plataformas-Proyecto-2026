// server/middleware/validators/authValidator.js

import { body, validationResult } from 'express-validator';

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

// ============================================================
//              VALIDACIONES PARA LOGIN
// ============================================================

export const validateLogin = [
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  
  handleValidationErrors
];

// ============================================================
//              VALIDACIONES PARA REGISTRO
// ============================================================

export const validateRegister = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras')
    .escape(),
  
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  handleValidationErrors
];

// ============================================================
//              VALIDACIONES PARA CAMBIAR CONTRASEÑA
// ============================================================

export const validateChangePassword = [
  body('userId')
    .notEmpty().withMessage('El ID de usuario es requerido')
    .trim(),
  
  body('oldPassword')
    .notEmpty().withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  handleValidationErrors
];