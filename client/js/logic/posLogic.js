// client/js/logic/posLogic.js

import { API_URL } from "../api/config.js";
import { $, showToast } from "../utils.js";
import { getPaises } from "../api/paises.js";
import { getCiudades } from "../api/ciudades.js";

// Estado del POS
let currentClient = {
  id: 'CONSUMIDOR-FINAL',
  nombre: 'Consumidor Final',
  tipo_cliente: 'minorista'
};

let invoiceItems = [];
let allProducts = [];
let searchTimeout = null;

// Cache para países y ciudades
let paisesCache = [];
let ciudadesCache = [];

// ============================================================
//                    INICIALIZACIÓN
// ============================================================
export function initPOS() {
  console.log("🏪 POS inicializado");
  
  // Cargar info del usuario
  loadUserInfo();
  
  // Iniciar reloj
  startClock();
  
  // Cargar productos
  loadProducts();
  
  // Event listeners
  setupEventListeners();
  
  // Cargar países para el formulario
  loadPaises();
}

// ============================================================
//                    USUARIO Y HEADER
// ============================================================
function loadUserInfo() {
  const userData = JSON.parse(localStorage.getItem('net_user') || '{}');
  const userName = $("#pos-user-name");
  if (userName) {
    userName.textContent = userData.nombre || 'Vendedor';
  }
}

function startClock() {
  const updateClock = () => {
    const now = new Date();
    
    const dateEl = $("#pos-date");
    const timeEl = $("#pos-time");
    
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('es-EC', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('es-EC', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
  };
  
  updateClock();
  setInterval(updateClock, 1000);
}

// ============================================================
//                    PRODUCTOS
// ============================================================
async function loadProducts(searchTerm = '') {
  const grid = $("#pos-products-grid");
  if (!grid) return;
  
  try {
    grid.innerHTML = '<div class="pos-loading">Cargando productos...</div>';
    
    const response = await fetch(`${API_URL}/api/productos`);
    const result = await response.json();
    
    allProducts = result.data || [];
    
    // Filtrar productos
    let filtered = allProducts.filter(p => p.activo && p.stock > 0);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.marca?.toLowerCase().includes(term)
      );
    }
    
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="pos-empty">No se encontraron productos</div>';
      return;
    }
    
    // Guardar productos en un Map para acceso rápido
    window.posProductsMap = new Map();
    
    grid.innerHTML = filtered.map(product => {
      // Guardar producto en el Map usando su ID
      window.posProductsMap.set(product.id, product);
      
      return `
        <div class="pos-product-card" data-product-id="${product.id}">
          <div class="pos-product-image">
            <img src="${product.imagen || './assets/images/placeholder.jpg'}" 
                 alt="${product.nombre}"
                 onerror="this.src='./assets/images/placeholder.jpg'">
          </div>
          <div class="pos-product-info">
            <h3 class="pos-product-name">${product.nombre}</h3>
            <p class="pos-product-brand">${product.marca || 'Sin marca'}</p>
            <div class="pos-product-details">
              <span class="pos-product-price">$${parseFloat(product.precio).toFixed(2)}</span>
              <span class="pos-product-stock">Stock: ${product.stock}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-add-product" 
                  data-product-id="${product.id}">
            ➕ Agregar
          </button>
        </div>
      `;
    }).join('');
    
    // Event listeners para botones de agregar
    grid.querySelectorAll('.btn-add-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const productData = window.posProductsMap.get(productId);
        if (productData) {
          addProductToInvoice(productData);
        } else {
          showToast('❌ Error al agregar producto');
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    grid.innerHTML = '<div class="pos-error">Error al cargar productos</div>';
  }
}

function addProductToInvoice(product) {
  // Verificar si ya existe en la factura
  const existingIndex = invoiceItems.findIndex(item => item.id === product.id);
  
  if (existingIndex !== -1) {
    // Incrementar cantidad
    const currentQty = invoiceItems[existingIndex].cantidad;
    if (currentQty < product.stock) {
      invoiceItems[existingIndex].cantidad++;
      showToast(`✅ Cantidad actualizada: ${product.nombre}`);
    } else {
      showToast(`⚠️ Stock insuficiente para ${product.nombre}`);
      return;
    }
  } else {
    // Agregar nuevo item
    invoiceItems.push({
      id: product.id,
      nombre: product.nombre,
      precio: parseFloat(product.precio),
      cantidad: 1,
      stock: product.stock,
      imagen: product.imagen
    });
    showToast(`✅ Agregado: ${product.nombre}`);
  }
  
  renderInvoiceItems();
  calculateTotals();
}

// ============================================================
//                    FACTURA
// ============================================================
function renderInvoiceItems() {
  const container = $("#pos-invoice-items");
  if (!container) return;
  
  if (invoiceItems.length === 0) {
    container.innerHTML = `
      <div class="pos-empty-invoice">
        <p>No hay productos en la factura</p>
        <p class="pos-hint">Selecciona productos de la izquierda</p>
      </div>
    `;
    return;
  }
  
  // Renderizar items en formato lista compacta estilo caja
  container.innerHTML = `
    <div class="pos-items-list">
      <div class="pos-items-header">
        <span class="col-qty">Cant.</span>
        <span class="col-name">Producto</span>
        <span class="col-price">P.Unit</span>
        <span class="col-subtotal">Subtotal</span>
        <span class="col-actions"></span>
      </div>
      ${invoiceItems.map((item, index) => `
        <div class="pos-item-row" data-index="${index}">
          <div class="col-qty">
            <div class="pos-qty-compact">
              <button class="btn-qty-sm btn-qty-minus" data-index="${index}">−</button>
              <span class="qty-value">${item.cantidad}</span>
              <button class="btn-qty-sm btn-qty-plus" data-index="${index}">+</button>
            </div>
          </div>
          <div class="col-name" title="${item.nombre}">
            <span class="item-name">${item.nombre}</span>
          </div>
          <div class="col-price">$${item.precio.toFixed(2)}</div>
          <div class="col-subtotal">$${(item.cantidad * item.precio).toFixed(2)}</div>
          <div class="col-actions">
            <button class="btn-remove-sm" data-index="${index}" title="Eliminar">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="pos-items-count">
      📦 ${invoiceItems.length} producto(s) · ${invoiceItems.reduce((sum, item) => sum + item.cantidad, 0)} unidad(es)
    </div>
  `;
  
  // Event listeners para controles de items
  setupItemControls();
}

function setupItemControls() {
  // Botones de cantidad (versión compacta)
  document.querySelectorAll('.btn-qty-minus, .btn-qty-sm.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (invoiceItems[index].cantidad > 1) {
        invoiceItems[index].cantidad--;
        renderInvoiceItems();
        calculateTotals();
      }
    });
  });
  
  document.querySelectorAll('.btn-qty-plus, .btn-qty-sm.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (invoiceItems[index].cantidad < invoiceItems[index].stock) {
        invoiceItems[index].cantidad++;
        renderInvoiceItems();
        calculateTotals();
      } else {
        showToast('⚠️ Stock insuficiente');
      }
    });
  });
  
  // Input de cantidad manual (si existe)
  document.querySelectorAll('.pos-qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      let newQty = parseInt(e.target.value);
      
      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
      } else if (newQty > invoiceItems[index].stock) {
        newQty = invoiceItems[index].stock;
        showToast('⚠️ Cantidad ajustada al stock disponible');
      }
      
      invoiceItems[index].cantidad = newQty;
      renderInvoiceItems();
      calculateTotals();
    });
  });
  
  // Input de precio manual (si existe)
  document.querySelectorAll('.pos-price-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      let newPrice = parseFloat(e.target.value);
      
      if (isNaN(newPrice) || newPrice < 0.01) {
        newPrice = 0.01;
      }
      
      invoiceItems[index].precio = newPrice;
      renderInvoiceItems();
      calculateTotals();
    });
  });
  
  // Botones de eliminar (ambas versiones)
  document.querySelectorAll('.btn-remove-item, .btn-remove-sm').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const itemName = invoiceItems[index].nombre;
      
      if (confirm(`¿Eliminar "${itemName}" de la factura?`)) {
        invoiceItems.splice(index, 1);
        renderInvoiceItems();
        calculateTotals();
        showToast(`🗑️ Producto eliminado`);
      }
    });
  });
}

function calculateTotals() {
  const subtotal = invoiceItems.reduce((sum, item) => 
    sum + (item.cantidad * item.precio), 0
  );
  
  const iva = subtotal * 0.15; // 15% IVA
  const total = subtotal + iva;
  
  const subtotalEl = $("#pos-subtotal");
  const ivaEl = $("#pos-iva");
  const totalEl = $("#pos-total");
  
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (ivaEl) ivaEl.textContent = `$${iva.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================================
//                    PAÍSES Y CIUDADES
// ============================================================
async function loadPaises() {
  try {
    // Usar la API existente del proyecto
    paisesCache = await getPaises();
    
    const selectPais = $("#select-pais");
    if (selectPais) {
      selectPais.innerHTML = '<option value="">Seleccione un país...</option>' +
        paisesCache.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    }
    
    console.log('✅ Países cargados:', paisesCache.length);
  } catch (error) {
    console.error('❌ Error cargando países:', error);
  }
}

async function loadCiudades(paisId) {
  const selectCiudad = $("#select-ciudad");
  if (!selectCiudad) return;
  
  if (!paisId) {
    selectCiudad.innerHTML = '<option value="">Primero seleccione un país...</option>';
    selectCiudad.disabled = true;
    return;
  }
  
  try {
    selectCiudad.innerHTML = '<option value="">Cargando ciudades...</option>';
    selectCiudad.disabled = true;
    
    // Usar fetch con query param para filtrar por país
    // El campo en tu tabla es "paisId" (camelCase según Prisma)
    const response = await fetch(`${API_URL}/api/ciudades?paisId=${paisId}`);
    const result = await response.json();
    
    ciudadesCache = result.data || [];
    
    if (ciudadesCache.length === 0) {
      selectCiudad.innerHTML = '<option value="">No hay ciudades disponibles</option>';
    } else {
      selectCiudad.innerHTML = '<option value="">Seleccione una ciudad...</option>' +
        ciudadesCache.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
      selectCiudad.disabled = false;
    }
    
    console.log('✅ Ciudades cargadas:', ciudadesCache.length);
  } catch (error) {
    console.error('❌ Error cargando ciudades:', error);
    selectCiudad.innerHTML = '<option value="">Error al cargar ciudades</option>';
  }
}

// ============================================================
//                    CLIENTES
// ============================================================
let clientSearchTimeout = null;
let clientsCache = [];

async function searchClients(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  try {
    const response = await fetch(`${API_URL}/api/clientes`);
    const result = await response.json();
    
    clientsCache = result.data || [];
    
    const term = searchTerm.toLowerCase();
    return clientsCache.filter(c => 
      c.nombre.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error buscando clientes:', error);
    return [];
  }
}

function showClientAutocomplete(clients) {
  // Eliminar autocomplete anterior si existe
  const oldAutocomplete = document.querySelector('.pos-client-autocomplete');
  if (oldAutocomplete) oldAutocomplete.remove();
  
  if (clients.length === 0) return;
  
  const searchInput = $("#pos-client-search");
  const autocomplete = document.createElement('div');
  autocomplete.className = 'pos-client-autocomplete';
  
  autocomplete.innerHTML = clients.map(client => `
    <div class="pos-client-option" data-client='${JSON.stringify(client)}'>
      <strong>${client.nombre}</strong>
      <span>${client.email || client.id}</span>
    </div>
  `).join('');
  
  searchInput.parentElement.appendChild(autocomplete);
  
  // Event listeners
  autocomplete.querySelectorAll('.pos-client-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const clientData = JSON.parse(e.currentTarget.dataset.client);
      selectClient(clientData);
      autocomplete.remove();
    });
  });
  
  // Cerrar al hacer click fuera
  setTimeout(() => {
    document.addEventListener('click', function closeAutocomplete(e) {
      if (!e.target.closest('.pos-client-selector')) {
        autocomplete.remove();
        document.removeEventListener('click', closeAutocomplete);
      }
    });
  }, 100);
}

function selectClient(client) {
  currentClient = client;
  
  const selectedEl = $("#pos-client-selected");
  const searchInput = $("#pos-client-search");
  
  if (selectedEl) {
    selectedEl.innerHTML = `
      <strong>${client.nombre}</strong>
      <span>${client.email || client.telefono || client.id}</span>
    `;
  }
  
  if (searchInput) {
    searchInput.value = '';
  }
  
  showToast(`✅ Cliente seleccionado: ${client.nombre}`);
}

// ============================================================
//                    MODAL NUEVO CLIENTE
// ============================================================
function openNewClientModal() {
  const modal = $("#pos-modal-new-client");
  if (modal) {
    modal.classList.add('show');
    
    // Resetear el formulario
    const form = document.getElementById('pos-form-new-client');
    if (form) {
      form.reset();
      clearAllFieldErrors();
    }
    
    // Resetear el select de ciudad
    const selectCiudad = $("#select-ciudad");
    if (selectCiudad) {
      selectCiudad.innerHTML = '<option value="">Primero seleccione un país...</option>';
      selectCiudad.disabled = true;
    }
    
    // Configurar el hint para cédula por defecto
    updateDocumentoHint('cedula');
  }
}

function closeNewClientModal() {
  const modal = $("#pos-modal-new-client");
  if (modal) {
    modal.classList.remove('show');
    document.getElementById('pos-form-new-client')?.reset();
    clearAllFieldErrors();
  }
}

// ============================================================
//                    VALIDACIONES DE FORMULARIO
// ============================================================
function clearAllFieldErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.form-group.has-error').forEach(el => {
    el.classList.remove('has-error');
  });
  document.querySelectorAll('input.input-error, select.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
}

function showFieldError(fieldName, message) {
  const errorEl = $(`#error-${fieldName}`);
  const inputEl = document.querySelector(`[name="${fieldName}"]`);
  
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
  
  if (inputEl) {
    inputEl.classList.add('input-error');
    inputEl.closest('.form-group')?.classList.add('has-error');
  }
}

function clearFieldError(fieldName) {
  const errorEl = $(`#error-${fieldName}`);
  const inputEl = document.querySelector(`[name="${fieldName}"]`);
  
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
  
  if (inputEl) {
    inputEl.classList.remove('input-error');
    inputEl.closest('.form-group')?.classList.remove('has-error');
  }
}

function updateDocumentoHint(tipo) {
  const hintEl = $("#hint-id");
  const inputEl = document.querySelector('[name="id"]');
  
  if (tipo === 'cedula') {
    if (hintEl) hintEl.textContent = 'Ingrese 10 dígitos para cédula';
    if (inputEl) {
      inputEl.maxLength = 10;
      inputEl.placeholder = '1234567890';
    }
  } else {
    if (hintEl) hintEl.textContent = 'Ingrese 13 dígitos para RUC';
    if (inputEl) {
      inputEl.maxLength = 13;
      inputEl.placeholder = '1234567890001';
    }
  }
}

function validateForm(formData) {
  let isValid = true;
  clearAllFieldErrors();
  
  const tipoDocumento = formData.get('tipo_documento');
  const id = formData.get('id')?.trim();
  const nombre = formData.get('nombre')?.trim();
  const email = formData.get('email')?.trim();
  const telefono = formData.get('telefono')?.trim();
  const pais = formData.get('pais');
  const ciudad = formData.get('ciudad');
  
  // Validar Cédula/RUC
  if (!id) {
    showFieldError('id', 'La cédula/RUC es obligatoria');
    isValid = false;
  } else if (!/^\d+$/.test(id)) {
    showFieldError('id', 'Solo se permiten números');
    isValid = false;
  } else if (tipoDocumento === 'cedula' && id.length !== 10) {
    showFieldError('id', 'La cédula debe tener exactamente 10 dígitos');
    isValid = false;
  } else if (tipoDocumento === 'ruc' && id.length !== 13) {
    showFieldError('id', 'El RUC debe tener exactamente 13 dígitos');
    isValid = false;
  }
  
  // Validar Nombre (obligatorio)
  if (!nombre) {
    showFieldError('nombre', 'El nombre es obligatorio');
    isValid = false;
  } else if (nombre.length < 3) {
    showFieldError('nombre', 'El nombre debe tener al menos 3 caracteres');
    isValid = false;
  }
  
  // Validar Email (opcional pero si se ingresa debe ser válido)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('email', 'Ingrese un email válido');
    isValid = false;
  }
  
  // Validar Teléfono (opcional pero si se ingresa solo números)
  if (telefono && !/^\d+$/.test(telefono)) {
    showFieldError('telefono', 'El teléfono solo puede contener números');
    isValid = false;
  }
  
  // Validar País
  if (!pais) {
    showFieldError('pais', 'Seleccione un país');
    isValid = false;
  }
  
  // Validar Ciudad
  if (!ciudad) {
    showFieldError('ciudad', 'Seleccione una ciudad');
    isValid = false;
  }
  
  return isValid;
}

// Función para filtrar solo números en inputs
function filterNumericInput(e) {
  const value = e.target.value;
  e.target.value = value.replace(/[^\d]/g, '');
}

async function saveNewClient(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const saveBtn = $("#pos-form-save");
  
  // Validar formulario
  if (!validateForm(formData)) {
    showToast('⚠️ Por favor corrige los errores del formulario');
    return;
  }
  
  // Obtener el nombre del país seleccionado
  const selectPais = $("#select-pais");
  const paisNombre = selectPais?.options[selectPais.selectedIndex]?.text || '';
  
  const data = {
    id: formData.get('id').trim(),
    nombre: formData.get('nombre').trim(),
    email: formData.get('email')?.trim() || null,
    telefono: formData.get('telefono')?.trim() || null,
    direccion: formData.get('direccion')?.trim() || 'No especificada',
    ciudad: formData.get('ciudad'),
    pais: paisNombre,
    tipo_cliente: formData.get('tipo_cliente'),
    activo: formData.get('activo') === 'on'
  };
  
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';
  }
  
  try {
    const response = await fetch(`${API_URL}/api/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear cliente');
    }
    
    const result = await response.json();
    
    showToast('✅ Cliente creado exitosamente');
    closeNewClientModal();
    
    // Seleccionar el cliente recién creado
    selectClient(result.data);
    
  } catch (error) {
    console.error('Error creando cliente:', error);
    showToast(`❌ Error: ${error.message}`);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Guardar cliente';
    }
  }
}

// ============================================================
//                    GENERAR FACTURA
// ============================================================
async function generateInvoice() {
  // Validaciones
  if (invoiceItems.length === 0) {
    showToast('⚠️ Agrega productos a la factura');
    return;
  }
  
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
  if (!paymentMethod) {
    showToast('⚠️ Selecciona un método de pago');
    return;
  }
  
  const generateBtn = $("#pos-generate-invoice");
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Procesando...';
  }
  
  try {
    // Calcular totales
    const subtotal = invoiceItems.reduce((sum, item) => 
      sum + (item.cantidad * item.precio), 0
    );
    const iva = subtotal * 0.15;
    const total = subtotal + iva;
    
    // Preparar datos de la factura
    const invoiceData = {
      cliente_id: currentClient.id,
      numero_factura: `FAC-${Date.now()}`,
      fecha_emision: new Date().toISOString(),
      subtotal: subtotal.toFixed(2),
      impuestos: iva.toFixed(2),
      total: total.toFixed(2),
      estado: 'emitida'
    };
    
    console.log('📄 Generando factura:', invoiceData);
    
    // Insertar factura
    const response = await fetch(`${API_URL}/api/facturas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al generar factura');
    }
    
    const result = await response.json();
    
    // Actualizar stock de productos
    for (const item of invoiceItems) {
      await updateProductStock(item.id, item.cantidad);
    }
    
    showToast('✅ Factura generada exitosamente');
    
    // Limpiar factura
    clearInvoice();
    
    // Recargar productos
    await loadProducts();
    
  } catch (error) {
    console.error('❌ Error generando factura:', error);
    showToast(`❌ Error: ${error.message}`);
  } finally {
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.textContent = '✅ Generar factura';
    }
  }
}

async function updateProductStock(productId, quantitySold) {
  try {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const newStock = product.stock - quantitySold;
    
    await fetch(`${API_URL}/api/productos/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stock: newStock
      })
    });
    
  } catch (error) {
    console.error('Error actualizando stock:', error);
  }
}

function clearInvoice() {
  invoiceItems = [];
  currentClient = {
    id: 'CONSUMIDOR-FINAL',
    nombre: 'Consumidor Final',
    tipo_cliente: 'minorista'
  };
  
  renderInvoiceItems();
  calculateTotals();
  
  const selectedEl = $("#pos-client-selected");
  if (selectedEl) {
    selectedEl.innerHTML = '<strong>Consumidor Final</strong>';
  }
  
  // Reset método de pago
  const efectivoRadio = document.querySelector('input[name="payment-method"][value="efectivo"]');
  if (efectivoRadio) efectivoRadio.checked = true;
}

// ============================================================
//                    EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  // Logout
  $("#pos-logout")?.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('net_token');
      localStorage.removeItem('net_user');
      location.hash = '#/login';
    }
  });
  
  // Búsqueda de productos
  const productSearch = $("#pos-product-search");
  if (productSearch) {
    productSearch.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadProducts(e.target.value);
      }, 300);
    });
  }
  
  // Búsqueda de clientes
  const clientSearch = $("#pos-client-search");
  if (clientSearch) {
    clientSearch.addEventListener('input', async (e) => {
      clearTimeout(clientSearchTimeout);
      clientSearchTimeout = setTimeout(async () => {
        const clients = await searchClients(e.target.value);
        showClientAutocomplete(clients);
      }, 300);
    });
  }
  
  // Nuevo cliente
  $("#pos-new-client")?.addEventListener('click', openNewClientModal);
  $("#pos-modal-close")?.addEventListener('click', closeNewClientModal);
  $("#pos-form-cancel")?.addEventListener('click', closeNewClientModal);
  
  // Form nuevo cliente
  $("#pos-form-new-client")?.addEventListener('submit', saveNewClient);
  
  // Selector de tipo de documento (Cédula/RUC)
  document.querySelectorAll('input[name="tipo_documento"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateDocumentoHint(e.target.value);
      clearFieldError('id');
      // Limpiar el campo cuando cambia el tipo
      const idInput = document.querySelector('[name="id"]');
      if (idInput) idInput.value = '';
    });
  });
  
  // Filtrar solo números en campo ID (Cédula/RUC)
  const idInput = document.querySelector('[name="id"]');
  if (idInput) {
    idInput.addEventListener('input', filterNumericInput);
    idInput.addEventListener('blur', () => {
      const formData = new FormData(document.getElementById('pos-form-new-client'));
      const tipoDocumento = formData.get('tipo_documento');
      const id = idInput.value.trim();
      
      if (id) {
        clearFieldError('id');
        if (!/^\d+$/.test(id)) {
          showFieldError('id', 'Solo se permiten números');
        } else if (tipoDocumento === 'cedula' && id.length !== 10) {
          showFieldError('id', 'La cédula debe tener exactamente 10 dígitos');
        } else if (tipoDocumento === 'ruc' && id.length !== 13) {
          showFieldError('id', 'El RUC debe tener exactamente 13 dígitos');
        }
      }
    });
  }
  
  // Filtrar solo números en campo teléfono
  const telefonoInput = document.querySelector('[name="telefono"]');
  if (telefonoInput) {
    telefonoInput.addEventListener('input', filterNumericInput);
  }
  
  // Validar nombre en tiempo real
  const nombreInput = document.querySelector('[name="nombre"]');
  if (nombreInput) {
    nombreInput.addEventListener('blur', () => {
      const value = nombreInput.value.trim();
      clearFieldError('nombre');
      if (!value) {
        showFieldError('nombre', 'El nombre es obligatorio');
      } else if (value.length < 3) {
        showFieldError('nombre', 'El nombre debe tener al menos 3 caracteres');
      }
    });
  }
  
  // Cargar ciudades cuando cambia el país
  const selectPais = $("#select-pais");
  if (selectPais) {
    selectPais.addEventListener('change', (e) => {
      const paisId = e.target.value;
      loadCiudades(paisId);
      clearFieldError('pais');
    });
  }
  
  // Limpiar error de ciudad cuando se selecciona
  const selectCiudad = $("#select-ciudad");
  if (selectCiudad) {
    selectCiudad.addEventListener('change', () => {
      clearFieldError('ciudad');
    });
  }
  
  // Limpiar factura
  $("#pos-clear-invoice")?.addEventListener('click', () => {
    if (invoiceItems.length > 0 && confirm('¿Limpiar toda la factura?')) {
      clearInvoice();
      showToast('🗑️ Factura limpiada');
    }
  });
  
  // Cancelar factura
  $("#pos-cancel")?.addEventListener('click', () => {
    if (invoiceItems.length > 0 && confirm('¿Cancelar la factura actual?')) {
      clearInvoice();
      showToast('❌ Factura cancelada');
    }
  });
  
  // Generar factura
  $("#pos-generate-invoice")?.addEventListener('click', generateInvoice);
  
  // Cerrar modal al hacer click fuera
  $("#pos-modal-new-client")?.addEventListener('click', (e) => {
    if (e.target.id === 'pos-modal-new-client') {
      closeNewClientModal();
    }
  });
}