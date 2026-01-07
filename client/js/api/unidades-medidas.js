import { createAPI } from './generic.api.js';
const API = createAPI('unidades-medidas');
export const getUnidadesMedidas = () => API.getAll();
export const getUnidadMedidaById = (id) => API.getById(id);
export const crearUnidadMedida = (data) => API.create(data);
export const actualizarUnidadMedida = (id, data) => API.update(id, data);
export const eliminarUnidadMedida = (id) => API.delete(id);
