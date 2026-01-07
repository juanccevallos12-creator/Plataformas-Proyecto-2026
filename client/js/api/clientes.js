import { createAPI } from './generic.api.js';
const API = createAPI('clientes');
export const getClientes = () => API.getAll();
export const getClienteById = (id) => API.getById(id);
export const crearCliente = (data) => API.create(data);
export const actualizarCliente = (id, data) => API.update(id, data);
export const eliminarCliente = (id) => API.delete(id);
