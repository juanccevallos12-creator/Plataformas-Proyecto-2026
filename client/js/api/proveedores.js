import { createAPI } from './generic.api.js';
const API = createAPI('proveedores');
export const getProveedores = () => API.getAll();
export const getProveedorById = (id) => API.getById(id);
export const crearProveedor = (data) => API.create(data);
export const actualizarProveedor = (id, data) => API.update(id, data);
export const eliminarProveedor = (id) => API.delete(id);
