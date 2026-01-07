import { createAPI } from './generic.api.js';
const API = createAPI('estados');
export const getEstados = () => API.getAll();
export const getEstadoById = (id) => API.getById(id);
export const crearEstado = (data) => API.create(data);
export const actualizarEstado = (id, data) => API.update(id, data);
export const eliminarEstado = (id) => API.delete(id);
