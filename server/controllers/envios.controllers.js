// server/controllers/envios.controllers.js
export const EnviosController = {
  
  async calcularCosto(req, res, next) {
    try {
      const { ciudad, peso, tipoEnvio } = req.body;
      
      // Lógica de cálculo de envío
      let costoBase = 5.00;
      
      // Ciudades principales: envío gratis en compras >$100
      const ciudadesPrincipales = ['Quito', 'Guayaquil', 'Cuenca'];
      
      if (ciudadesPrincipales.includes(ciudad)) {
        costoBase = 5.00;
      } else {
        costoBase = 8.00;
      }
      
      // Ajuste por peso
      if (peso > 5) {
        costoBase += (peso - 5) * 0.50;
      }
      
      // Tipo de envío
      if (tipoEnvio === 'express') {
        costoBase *= 1.5;
      }
      
      res.json({
        status: 'success',
        data: {
          costo: costoBase.toFixed(2),
          ciudad,
          tipoEnvio: tipoEnvio || 'normal',
          tiempoEstimado: tipoEnvio === 'express' ? '1-2 días' : '3-5 días'
        }
      });
    } catch (err) {
      console.error('Error al calcular envío:', err);
      next(err);
    }
  },
  
  async obtenerOpciones(req, res, next) {
    try {
      res.json({
        status: 'success',
        data: {
          opciones: [
            {
              id: 'normal',
              nombre: 'Envío Normal',
              descripcion: 'Entrega en 3-5 días hábiles',
              costoBase: 5.00
            },
            {
              id: 'express',
              nombre: 'Envío Express',
              descripcion: 'Entrega en 1-2 días hábiles',
              costoBase: 7.50
            },
            {
              id: 'pickup',
              nombre: 'Retiro en Tienda',
              descripcion: 'Retira en nuestra tienda física',
              costoBase: 0
            }
          ]
        }
      });
    } catch (err) {
      console.error('Error al obtener opciones de envío:', err);
      next(err);
    }
  }
};