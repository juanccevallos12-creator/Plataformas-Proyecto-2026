import { createAPI } from './generic.api.js';
const API = createAPI('ajustes');
export const getAjustes = () => API.getAll();
export const getAjusteById = (id) => API.getById(id);
export const crearAjuste = (data) => API.create(data);
export const actualizarAjuste = (id, data) => API.update(id, data);
export const eliminarAjuste = (id) => API.delete(id);
