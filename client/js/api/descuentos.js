import { createAPI } from './generic.api.js';
const API = createAPI('descuentos');
export const getDescuentos = () => API.getAll();
export const getDescuentoById = (id) => API.getById(id);
export const crearDescuento = (data) => API.create(data);
export const actualizarDescuento = (id, data) => API.update(id, data);
export const eliminarDescuento = (id) => API.delete(id);
