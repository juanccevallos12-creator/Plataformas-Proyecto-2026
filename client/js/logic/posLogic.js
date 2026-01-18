// client/js/logic/posLogic.js

import { API_URL } from "../api/config.js";
import { $, showToast } from "../utils.js";

// Estado del POS
let currentClient = {
  id: 'CONSUMIDOR-FINAL',
  nombre: 'Consumidor Final',
  tipo_cliente: 'minorista'
};

let invoiceItems = [];
let allProducts = [];
let searchTimeout = null;

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
    
    grid.innerHTML = filtered.map(product => `
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
                data-product='${JSON.stringify(product)}'>
          ➕ Agregar
        </button>
      </div>
    `).join('');
    
    // Event listeners para botones de agregar
    grid.querySelectorAll('.btn-add-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productData = JSON.parse(e.target.dataset.product);
        addProductToInvoice(productData);
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
  
  container.innerHTML = invoiceItems.map((item, index) => `
    <div class="pos-invoice-item" data-index="${index}">
      <div class="pos-item-image">
        <img src="${item.imagen || './assets/images/placeholder.jpg'}" 
             alt="${item.nombre}"
             onerror="this.src='./assets/images/placeholder.jpg'">
      </div>
      
      <div class="pos-item-info">
        <h4>${item.nombre}</h4>
        <div class="pos-item-controls">
          <div class="pos-quantity-control">
            <button class="btn-qty btn-qty-minus" data-index="${index}">−</button>
            <input type="number" 
                   class="pos-qty-input" 
                   value="${item.cantidad}" 
                   min="1" 
                   max="${item.stock}"
                   data-index="${index}">
            <button class="btn-qty btn-qty-plus" data-index="${index}">+</button>
          </div>
          
          <div class="pos-price-control">
            <label>Precio:</label>
            <input type="number" 
                   class="pos-price-input" 
                   value="${item.precio.toFixed(2)}" 
                   step="0.01"
                   min="0.01"
                   data-index="${index}">
          </div>
        </div>
      </div>
      
      <div class="pos-item-subtotal">
        <strong>$${(item.cantidad * item.precio).toFixed(2)}</strong>
        <button class="btn-remove-item" data-index="${index}">🗑️</button>
      </div>
    </div>
  `).join('');
  
  // Event listeners para controles de items
  setupItemControls();
}

function setupItemControls() {
  // Botones de cantidad
  document.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (invoiceItems[index].cantidad > 1) {
        invoiceItems[index].cantidad--;
        renderInvoiceItems();
        calculateTotals();
      }
    });
  });
  
  document.querySelectorAll('.btn-qty-plus').forEach(btn => {
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
  
  // Input de cantidad manual
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
  
  // Input de precio manual
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
  
  // Botones de eliminar
  document.querySelectorAll('.btn-remove-item').forEach(btn => {
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

// Modal nuevo cliente
function openNewClientModal() {
  const modal = $("#pos-modal-new-client");
  if (modal) {
    modal.classList.add('show');
    
    // Generar ID automático
    const idInput = document.querySelector('#pos-form-new-client input[name="id"]');
    if (idInput && !idInput.value) {
      const randomId = `CLI-${Date.now().toString().slice(-6)}`;
      idInput.value = randomId;
    }
  }
}

function closeNewClientModal() {
  const modal = $("#pos-modal-new-client");
  if (modal) {
    modal.classList.remove('show');
    document.getElementById('pos-form-new-client')?.reset();
  }
}

async function saveNewClient(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const saveBtn = $("#pos-form-save");
  
  const data = {
    id: formData.get('id'),
    nombre: formData.get('nombre'),
    email: formData.get('email') || null,
    telefono: formData.get('telefono') || null,
    direccion: formData.get('direccion') || 'No especificada',
    ciudad: formData.get('ciudad') || 'No especificada',
    pais: formData.get('pais') || 'Ecuador',
    tipo_cliente: formData.get('tipo_cliente'),
    activo: formData.get('activo') === 'on',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
      estado: 'emitida',
      metodo_pago: paymentMethod.value,
      items: invoiceItems.map(item => ({
        producto_id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: (item.cantidad * item.precio).toFixed(2)
      }))
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
  const effectivoRadio = document.querySelector('input[name="payment-method"][value="efectivo"]');
  if (effectivoRadio) effectivoRadio.checked = true;
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