import { createAPI } from './generic.api.js';
const API = createAPI('ordenes-compra');
export const getOrdenesCompra = () => API.getAll();
export const getOrdenCompraById = (id) => API.getById(id);
export const crearOrdenCompra = (data) => API.create(data);
export const actualizarOrdenCompra = (id, data) => API.update(id, data);
export const eliminarOrdenCompra = (id) => API.delete(id);
