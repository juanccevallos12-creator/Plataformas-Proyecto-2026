// server/controllers/pagos.controllers.js
export const PagosController = {
  
  async procesarPago(req, res, next) {
    try {
      const { pedidoId, metodoPago, datosPago } = req.body;
      
      // SIMULACIÓN de procesamiento de pago
      // En producción: integrar con pasarela real (Stripe, PayPal, etc.)
      
      const pagoId = `PAG-${Date.now()}`;
      
      res.json({
        status: 'success',
        message: 'Pago procesado (simulación)',
        data: {
          id: pagoId,
          pedidoId,
          metodoPago,
          estado: 'aprobado',
          fecha: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error al procesar pago:', err);
      next(err);
    }
  },
  
  async verificarEstado(req, res, next) {
    try {
      const { id } = req.params;
      
      res.json({
        status: 'success',
        data: {
          id,
          estado: 'aprobado',
          fecha: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error al verificar pago:', err);
      next(err);
    }
  }
};