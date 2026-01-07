import { createAPI } from './generic.api.js';
const API = createAPI('categorias');
export const getCategorias = () => API.getAll();
export const getCategoriaById = (id) => API.getById(id);
export const crearCategoria = (data) => API.create(data);
export const actualizarCategoria = (id, data) => API.update(id, data);
export const eliminarCategoria = (id) => API.delete(id);
