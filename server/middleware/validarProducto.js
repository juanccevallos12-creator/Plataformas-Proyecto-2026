import { body, validationResult } from "express-validator";

export const validarProducto = [
  body("nombre").notEmpty().trim().escape(),
  body("precio").isFloat({ min: 0 }),
  body("categoria").optional().trim().escape(),
  body("imagen").optional().isURL(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array()
      });
    }
    next();
  }
];
