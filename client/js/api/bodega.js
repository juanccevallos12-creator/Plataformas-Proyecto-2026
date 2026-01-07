import { createAPI } from './generic.api.js';
const API = createAPI('bodega');
export const getBodegas = () => API.getAll();
export const getBodegaById = (id) => API.getById(id);
export const crearBodega = (data) => API.create(data);
export const actualizarBodega = (id, data) => API.update(id, data);
export const eliminarBodega = (id) => API.delete(id);
