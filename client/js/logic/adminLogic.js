import { COLLECTIONS } from "../config/collections.js";
import { API_URL } from "../api/config.js";
import { $, showToast } from "../utils.js";

const API_BASE = `${API_URL}/api`;

let currentCollection = 'productos';
let dataCache = [];
let editingItem = null;

// ============================================================
//              HELPER: OBTENER HEADERS CON TOKEN
// ============================================================
function getAuthHeaders() {
  const token = localStorage.getItem('net_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// ============================================================
//              CARGAR COLECCIÓN
// ============================================================
export async function loadCollection(collectionKey) {
  currentCollection = collectionKey;
  const config = COLLECTIONS[collectionKey];
  
  if (!config) {
    console.error('Colección no encontrada:', collectionKey);
    return;
  }

  // Actualizar título
  const title = $("#admin-section-title");
  if (title) {
    title.innerHTML = `${config.icon} ${config.name}`;
  }

  // Actualizar texto del botón "Nuevo"
  const btnText = $("#btn-new-text");
  if (btnText) {
    btnText.textContent = `Nuevo ${config.nameSingular || config.name.slice(0, -1)}`;
  }

  // Marcar menú activo
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.collection === collectionKey) {
      item.classList.add('active');
    }
  });

  // Cargar datos
  await fetchData();
}

// ============================================================
//              OBTENER DATOS DE LA API
// ============================================================
async function fetchData() {
  const config = COLLECTIONS[currentCollection];
  const tbody = $("#tbody-data");
  
  if (!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Cargando...</td></tr>';

  try {
    console.log(`📡 Cargando ${config.endpoint} desde ${API_BASE}/${config.endpoint}`);
    
    const response = await fetch(`${API_BASE}/${config.endpoint}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        showToast('❌ Sesión expirada. Por favor inicia sesión nuevamente.');
        setTimeout(() => {
          location.hash = '#/login';
        }, 1500);
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✅ Datos recibidos:`, result);
    dataCache = result.data || [];
    
    renderTable();
    renderStats();
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#ef4444;">Error al cargar datos</td></tr>';
    showToast('❌ Error al cargar datos');
  }
}

// ============================================================
//              RENDERIZAR TABLA
// ============================================================
function renderTable() {
  const config = COLLECTIONS[currentCollection];
  const tbody = $("#tbody-data");
  
  if (!tbody) return;

  if (dataCache.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:2rem; color:#9ca3af;">No hay registros</td></tr>`;
    return;
  }

  const columns = config.tableColumns || Object.keys(config.fields).slice(0, 5);

  tbody.innerHTML = dataCache.map(item => {
    const id = item.id || item._id;
    
    return `
      <tr data-id="${id}">
        ${columns.map(col => {
          let value = item[col];
          
          // Formateo especial
        if (col === 'imagen' && value) {
            return `<td><img src="${value}" alt="" class="admin-thumb" onerror="this.src='/assets/images/placeholder.jpg'"></td>`;
          }
          
          if (typeof value === 'boolean') {
            return `<td><span class="badge ${value ? 'ok' : 'soon'}">${value ? 'Sí' : 'No'}</span></td>`;
          }
          
          // Manejo seguro de números y precios
          if ((col.includes('precio') || col.includes('total') || col.includes('monto') || col.includes('costo')) && value != null) {
            const num = typeof value === 'string' ? parseFloat(value) : Number(value);
            if (!isNaN(num)) {
              return `<td>$${num.toFixed(2)}</td>`;
            }
          }
          
          if (typeof value === 'object' && value !== null) {
            return `<td>${JSON.stringify(value).substring(0, 30)}...</td>`;
          }
          
          if (col === 'activo' || col === 'leido') {
            return `<td><span class="badge ${value ? 'ok' : 'soon'}">${value ? 'Sí' : 'No'}</span></td>`;
          }
          
          // Manejo de fechas
          if (col.includes('fecha') || col.includes('created') || col.includes('updated') || col === 'createdAt') {
            if (value) {
              try {
                const date = new Date(value);
                return `<td>${date.toLocaleDateString('es-EC')}</td>`;
              } catch (e) {
                return `<td>${value}</td>`;
              }
            }
          }
          
          return `<td>${value || '-'}</td>`;
        }).join('')}
        <td class="admin-actions">
          <button class="btn-icon btn-edit" data-id="${id}" title="Editar">✏️</button>
          <button class="btn-icon btn-delete" data-id="${id}" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================
//              RENDERIZAR ESTADÍSTICAS
// ============================================================
function renderStats() {
  const stats = $("#admin-stats");
  if (!stats) return;

  const total = dataCache.length;
  const activos = dataCache.filter(item => item.activo !== false).length;

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-info">
        <span class="stat-value">${total}</span>
        <span class="stat-label">Total Registros</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-info">
        <span class="stat-value">${activos}</span>
        <span class="stat-label">Activos</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon">📝</div>
      <div class="stat-info">
        <span class="stat-value">${COLLECTIONS[currentCollection].name}</span>
        <span class="stat-label">Colección Actual</span>
      </div>
    </div>
  `;
}

// ============================================================
//              ABRIR MODAL CREAR/EDITAR
// ============================================================
export function openModal(item = null) {
  editingItem = item;
  const config = COLLECTIONS[currentCollection];
  const modal = $("#modal-crud");
  const modalTitle = $("#modal-title");
  const formFields = $("#form-fields");

  if (!modal || !modalTitle || !formFields) return;

  modalTitle.textContent = item ? `Editar ${config.nameSingular || config.name.slice(0, -1)}` : `Nuevo ${config.nameSingular || config.name.slice(0, -1)}`;

  // Generar campos del formulario
  formFields.innerHTML = Object.entries(config.fields).map(([key, field]) => {
    const value = item ? (item[key] || '') : '';
    
    if (field.type === 'textarea') {
      return `
        <div class="form-group full-width">
          <label for="field-${key}">${field.label} ${field.required ? '*' : ''}</label>
          <textarea id="field-${key}" name="${key}" rows="3" ${field.required ? 'required' : ''}>${value}</textarea>
        </div>
      `;
    }
    
    if (field.type === 'checkbox') {
      return `
        <div class="form-group">
          <label style="display:flex; align-items:center; gap:0.5rem;">
            <input type="checkbox" id="field-${key}" name="${key}" ${value ? 'checked' : ''}>
            <span>${field.label}</span>
          </label>
        </div>
      `;
    }
    
    return `
      <div class="form-group">
        <label for="field-${key}">${field.label} ${field.required ? '*' : ''}</label>
        <input 
          type="${field.type}" 
          id="field-${key}" 
          name="${key}" 
          value="${value}"
          ${field.required ? 'required' : ''}
          ${field.type === 'number' ? 'step="0.01"' : ''}
        >
      </div>
    `;
  }).join('');

  modal.classList.add('show');
}

// ============================================================
//              CERRAR MODAL
// ============================================================
export function closeModal() {
  const modal = $("#modal-crud");
  if (modal) {
    modal.classList.remove('show');
    editingItem = null;
  }
}

// ============================================================
//              GUARDAR (CREAR O ACTUALIZAR)
// ============================================================
export async function saveItem(e) {
  e.preventDefault();
  
  const config = COLLECTIONS[currentCollection];
  const formData = new FormData(e.target);
  const data = {};

  // Recopilar datos del formulario
  for (const [key, field] of Object.entries(config.fields)) {
    if (field.type === 'checkbox') {
      data[key] = formData.get(key) === 'on';
    } else if (field.type === 'number') {
      const value = formData.get(key);
      data[key] = value ? parseFloat(value) : 0;
    } else {
      data[key] = formData.get(key) || '';
    }
  }

  const btnSave = $("#btn-save");
  if (btnSave) {
    btnSave.disabled = true;
    btnSave.textContent = 'Guardando...';
  }

  try {
    let response;
    
    if (editingItem) {
      // Actualizar
      const id = editingItem.id || editingItem._id;
      response = await fetch(`${API_BASE}/${config.endpoint}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } else {
      // Crear
      response = await fetch(`${API_BASE}/${config.endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    }

    if (response.status === 401) {
      showToast('❌ Sesión expirada. Por favor inicia sesión nuevamente.');
      setTimeout(() => {
        location.hash = '#/login';
      }, 1500);
      return;
    }

    if (response.ok) {
      showToast(editingItem ? '✅ Actualizado correctamente' : '✅ Creado correctamente');
      closeModal();
      await fetchData();
    } else {
      const error = await response.json();
      showToast(`❌ Error: ${error.message || 'No se pudo guardar'}`);
    }
  } catch (error) {
    console.error('Error guardando:', error);
    showToast('❌ Error al guardar');
  } finally {
    if (btnSave) {
      btnSave.disabled = false;
      btnSave.textContent = 'Guardar';
    }
  }
}

// ============================================================
//              ELIMINAR
// ============================================================
export async function deleteItem(id) {
  const config = COLLECTIONS[currentCollection];
  const item = dataCache.find(i => (i.id || i._id) === id);
  
  if (!item) return;

  const itemName = item.nombre || item.codigo || item.id || 'este registro';
  
  if (!confirm(`¿Eliminar "${itemName}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${config.endpoint}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      showToast('❌ Sesión expirada. Por favor inicia sesión nuevamente.');
      setTimeout(() => {
        location.hash = '#/login';
      }, 1500);
      return;
    }

    if (response.ok) {
      showToast('🗑️ Eliminado correctamente');
      await fetchData();
    } else {
      showToast('❌ Error al eliminar');
    }
  } catch (error) {
    console.error('Error eliminando:', error);
    showToast('❌ Error al eliminar');
  }
}

// ============================================================
//              BUSCAR
// ============================================================
export function searchData(searchTerm) {
  if (!searchTerm) {
    renderTable();
    return;
  }

  const filtered = dataCache.filter(item => {
    const searchStr = JSON.stringify(item).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const tbody = $("#tbody-data");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:2rem; color:#9ca3af;">No se encontraron resultados</td></tr>';
    return;
  }

  // Usar la misma lógica de renderTable pero con datos filtrados
  const tempCache = dataCache;
  dataCache = filtered;
  renderTable();
  dataCache = tempCache;
}

// ============================================================
//              RENDER PANEL PRINCIPAL
// ============================================================
export async function renderAdminPanel() {
  const panel = $("#admin-panel");
  if (!panel) return;

  const config = COLLECTIONS[currentCollection];

  panel.innerHTML = `
    <div class="admin-header">
      <h1 id="admin-section-title">${config.icon} ${config.name}</h1>
      <button class="btn btn-primary" id="btn-new-item">
        ➕ <span id="btn-new-text">Nuevo ${config.nameSingular || config.name.slice(0, -1)}</span>
      </button>
    </div>

    <!-- BÚSQUEDA -->
    <div class="admin-filters">
      <input type="text" id="search-input" placeholder="🔍 Buscar..." class="admin-search">
    </div>

    <!-- ESTADÍSTICAS -->
    <div class="admin-stats" id="admin-stats"></div>

    <!-- TABLA -->
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            ${(config.tableColumns || Object.keys(config.fields).slice(0, 5)).map(col => 
              `<th>${col.toUpperCase()}</th>`
            ).join('')}
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody id="tbody-data">
          <tr><td colspan="10" style="text-align:center">Cargando...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CRUD -->
    <div id="modal-crud" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modal-title">Nuevo Registro</h2>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        
        <form id="form-crud" class="admin-form">
          <div class="form-grid" id="form-fields"></div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="btn-cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Cargar datos iniciales
  await fetchData();

  // Event listeners
  setupEventListeners();
}

// ============================================================
//              EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  // Botón nuevo
  $("#btn-new-item")?.addEventListener("click", () => openModal());

  // Búsqueda
  $("#search-input")?.addEventListener("input", (e) => searchData(e.target.value));

  // Botones de la tabla (delegación)
  $("#tbody-data")?.addEventListener("click", (e) => {
    const btnEdit = e.target.closest(".btn-edit");
    const btnDelete = e.target.closest(".btn-delete");

    if (btnEdit) {
      const id = btnEdit.dataset.id;
      const item = dataCache.find(i => (i.id || i._id) === id);
      if (item) openModal(item);
    }

    if (btnDelete) {
      const id = btnDelete.dataset.id;
      deleteItem(id);
    }
  });

  // Modal
  $("#modal-close")?.addEventListener("click", closeModal);
  $("#btn-cancel")?.addEventListener("click", closeModal);
  $("#form-crud")?.addEventListener("submit", saveItem);

  // Cerrar modal al hacer click fuera
  $("#modal-crud")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-crud") {
      closeModal();
    }
  });
}