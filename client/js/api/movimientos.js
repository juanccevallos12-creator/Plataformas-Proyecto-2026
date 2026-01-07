import { createAPI } from './generic.api.js';
const API = createAPI('movimientos');
export const getMovimientos = () => API.getAll();
export const getMovimientoById = (id) => API.getById(id);
export const crearMovimiento = (data) => API.create(data);
export const actualizarMovimiento = (id, data) => API.update(id, data);
export const eliminarMovimiento = (id) => API.delete(id);
