import { createAPI } from './generic.api.js';
const API = createAPI('ciudades');
export const getCiudades = () => API.getAll();
export const getCiudadById = (id) => API.getById(id);
export const crearCiudad = (data) => API.create(data);
export const actualizarCiudad = (id, data) => API.update(id, data);
export const eliminarCiudad = (id) => API.delete(id);
