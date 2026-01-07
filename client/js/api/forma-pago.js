import { createAPI } from './generic.api.js';
const API = createAPI('forma-pago');
export const getFormasPago = () => API.getAll();
export const getFormaPagoById = (id) => API.getById(id);
export const crearFormaPago = (data) => API.create(data);
export const actualizarFormaPago = (id, data) => API.update(id, data);
export const eliminarFormaPago = (id) => API.delete(id);
