import { createAPI } from './generic.api.js';
const API = createAPI('facturas');
export const getFacturas = () => API.getAll();
export const getFacturaById = (id) => API.getById(id);
export const crearFactura = (data) => API.create(data);
export const actualizarFactura = (id, data) => API.update(id, data);
export const eliminarFactura = (id) => API.delete(id);
