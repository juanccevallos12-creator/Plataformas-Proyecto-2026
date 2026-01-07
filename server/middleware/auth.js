// server/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación JWT
 */
export function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Token no proporcionado"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expirado"
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Token inválido"
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Error al verificar token"
    });
  }
}

/**
 * Middleware para requerir rol de administrador
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "No autenticado"
    });
  }

  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Se requiere rol de administrador"
    });
  }

  next();
}