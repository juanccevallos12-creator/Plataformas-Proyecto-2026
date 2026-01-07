import { createAPI } from './generic.api.js';
const API = createAPI('paises');
export const getPaises = () => API.getAll();
export const getPaisById = (id) => API.getById(id);
export const crearPais = (data) => API.create(data);
export const actualizarPais = (id, data) => API.update(id, data);
export const eliminarPais = (id) => API.delete(id);
