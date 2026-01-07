import { createAPI } from './generic.api.js';
const API = createAPI('ubicaciones');
export const getUbicaciones = () => API.getAll();
export const getUbicacionById = (id) => API.getById(id);
export const crearUbicacion = (data) => API.create(data);
export const actualizarUbicacion = (id, data) => API.update(id, data);
export const eliminarUbicacion = (id) => API.delete(id);
