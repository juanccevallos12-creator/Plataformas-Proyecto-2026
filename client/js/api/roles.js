import { createAPI } from './generic.api.js';
const API = createAPI('roles');
export const getRoles = () => API.getAll();
export const getRolById = (id) => API.getById(id);
export const crearRol = (data) => API.create(data);
export const actualizarRol = (id, data) => API.update(id, data);
export const eliminarRol = (id) => API.delete(id);
