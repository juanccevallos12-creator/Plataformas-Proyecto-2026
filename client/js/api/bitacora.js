import { createAPI } from './generic.api.js';
const API = createAPI('bitacora');
export const getBitacora = () => API.getAll();
export const getRegistroBitacoraById = (id) => API.getById(id);
export const crearRegistroBitacora = (data) => API.create(data);
export const actualizarRegistroBitacora = (id, data) => API.update(id, data);
export const eliminarRegistroBitacora = (id) => API.delete(id);
