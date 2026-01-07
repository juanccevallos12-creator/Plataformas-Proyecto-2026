export function requireAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado: requiere rol admin"
    });
  }
  next();
}
