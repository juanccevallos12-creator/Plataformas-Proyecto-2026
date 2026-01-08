// client/js/api/generic.api.js
import { API_URL } from './config.js';

const API_BASE = `${API_URL}/api`;

/**
 * Crea funciones CRUD para una colección específica
 * @param {string} endpoint - Nombre del endpoint (ej: 'categorias', 'clientes')
 * @returns {object} Objeto con funciones CRUD
 */
export function createAPI(endpoint) {
  return {
    /**
     * Obtener todos los registros
     */
    async getAll() {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}`);
        const result = await response.json();
        
        if (result.status === 'success') {
          return result.data || [];
        }
        throw new Error(result.message || 'Error al obtener datos');
      } catch (error) {
        console.error(`Error en getAll ${endpoint}:`, error);
        throw error;
      }
    },

    /**
     * Obtener un registro por ID
     * @param {string} id - ID del registro
     */
    async getById(id) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`);
        const result = await response.json();
        
        if (result.status === 'success') {
          return result.data;
        }
        throw new Error(result.message || 'Registro no encontrado');
      } catch (error) {
        console.error(`Error en getById ${endpoint}:`, error);
        throw error;
      }
    },

    /**
     * Crear un nuevo registro
     * @param {object} data - Datos del registro
     */
    async create(data) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          return result.data;
        }
        throw new Error(result.message || 'Error al crear registro');
      } catch (error) {
        console.error(`Error en create ${endpoint}:`, error);
        throw error;
      }
    },

    /**
     * Actualizar un registro
     * @param {string} id - ID del registro
     * @param {object} data - Datos actualizados
     */
    async update(id, data) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          return result.data;
        }
        throw new Error(result.message || 'Error al actualizar registro');
      } catch (error) {
        console.error(`Error en update ${endpoint}:`, error);
        throw error;
      }
    },

    /**
     * Eliminar un registro
     * @param {string} id - ID del registro
     */
    async delete(id) {
      try {
        const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          return true;
        }
        throw new Error(result.message || 'Error al eliminar registro');
      } catch (error) {
        console.error(`Error en delete ${endpoint}:`, error);
        throw error;
      }
    }
  };
}

// Exportar APIs para todas las colecciones
export const CategoriasAPI = createAPI('categorias');
export const ClientesAPI = createAPI('clientes');
export const UbicacionesAPI = createAPI('ubicaciones');
export const BodegaAPI = createAPI('bodega');
export const ProveedoresAPI = createAPI('proveedores');
export const MovimientosAPI = createAPI('movimientos');
export const OrdenesCompraAPI = createAPI('ordenes-compra');
export const DescuentosAPI = createAPI('descuentos');
export const PaisesAPI = createAPI('paises');
export const CiudadesAPI = createAPI('ciudades');
export const RolesAPI = createAPI('roles');
export const EstadosAPI = createAPI('estados');
export const FormaPagoAPI = createAPI('forma-pago');
export const UnidadesMedidasAPI = createAPI('unidades-medidas');
export const AjustesAPI = createAPI('ajustes');
export const BitacoraAPI = createAPI('bitacora');
export const FacturasAPI = createAPI('facturas');
export const CarritoAPI = createAPI('carrito');