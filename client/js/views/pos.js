// client/js/views/pos.js

export function POSView() {
  return `
    <div class="pos-container">
      <!-- Header del POS -->
      <header class="pos-header">
        <div class="pos-header-left">
          <h1>🏪 New Era Tech - POS</h1>
        </div>
        <div class="pos-header-center">
          <div class="pos-datetime">
            <span id="pos-date"></span>
            <span id="pos-time"></span>
          </div>
        </div>
        <div class="pos-header-right">
          <div class="pos-user-info">
            <span class="pos-user-icon">👤</span>
            <span id="pos-user-name">Vendedor</span>
          </div>
          <button class="btn btn-secondary" id="pos-logout">Cerrar sesión</button>
        </div>
      </header>

      <!-- Contenedor principal -->
      <div class="pos-main">
        
        <!-- Columna izquierda: Productos -->
        <aside class="pos-products-panel">
          <div class="pos-section-header">
            <h2>📦 Productos</h2>
          </div>

          <div class="pos-search-box">
            <input 
              type="text" 
              id="pos-product-search" 
              placeholder="🔍 Buscar por nombre o código..."
              autocomplete="off"
            >
          </div>

          <div class="pos-products-grid" id="pos-products-grid">
            <div class="pos-loading">Cargando productos...</div>
          </div>
        </aside>

        <!-- Columna derecha: Factura actual -->
        <main class="pos-invoice-panel">
          
          <!-- Cliente -->
          <section class="pos-section">
            <div class="pos-section-header">
              <h2>👤 Cliente</h2>
              <button class="btn btn-primary btn-sm" id="pos-new-client">
                ➕ Nuevo cliente
              </button>
            </div>

            <div class="pos-client-selector">
              <input 
                type="text" 
                id="pos-client-search" 
                placeholder="Buscar cliente..."
                autocomplete="off"
              >
              <div class="pos-client-selected" id="pos-client-selected">
                <strong>Consumidor Final</strong>
              </div>
            </div>
          </section>

          <!-- Items de la factura -->
          <section class="pos-section pos-items-section">
            <div class="pos-section-header">
              <h2>🛒 Factura</h2>
              <button class="btn btn-secondary btn-sm" id="pos-clear-invoice">
                🗑️ Limpiar
              </button>
            </div>

            <div class="pos-invoice-items" id="pos-invoice-items">
              <div class="pos-empty-invoice">
                <p>No hay productos en la factura</p>
                <p class="pos-hint">Selecciona productos de la izquierda</p>
              </div>
            </div>
          </section>

          <!-- Totales -->
          <section class="pos-totals">
            <div class="pos-total-row">
              <span>Subtotal:</span>
              <strong id="pos-subtotal">$0.00</strong>
            </div>
            <div class="pos-total-row">
              <span>IVA (15%):</span>
              <strong id="pos-iva">$0.00</strong>
            </div>
            <div class="pos-total-row pos-total-final">
              <span>TOTAL:</span>
              <strong id="pos-total">$0.00</strong>
            </div>
          </section>

          <!-- Método de pago -->
          <section class="pos-section">
            <div class="pos-section-header">
              <h2>💳 Método de pago</h2>
            </div>
            <div class="pos-payment-methods">
              <label class="pos-payment-option">
                <input type="radio" name="payment-method" value="efectivo" checked>
                <span>💵 Efectivo</span>
              </label>
              <label class="pos-payment-option">
                <input type="radio" name="payment-method" value="tarjeta">
                <span>💳 Tarjeta</span>
              </label>
              <label class="pos-payment-option">
                <input type="radio" name="payment-method" value="transferencia">
                <span>🏦 Transferencia</span>
              </label>
            </div>
          </section>

          <!-- Acciones -->
          <div class="pos-actions">
            <button class="btn btn-secondary btn-lg" id="pos-cancel">
              ❌ Cancelar
            </button>
            <button class="btn btn-primary btn-lg" id="pos-generate-invoice">
              ✅ Generar factura
            </button>
          </div>

        </main>
      </div>

      <!-- Modal: Nuevo Cliente -->
      <div id="pos-modal-new-client" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>➕ Nuevo Cliente</h2>
            <button class="modal-close" id="pos-modal-close">✕</button>
          </div>

          <form id="pos-form-new-client" class="pos-form">
            <div class="form-grid">
              
              <div class="form-group">
                <label>ID Cliente *</label>
                <input type="text" name="id" required placeholder="CLI-001">
              </div>

              <div class="form-group">
                <label>Nombre completo *</label>
                <input type="text" name="nombre" required placeholder="Juan Pérez">
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="cliente@email.com">
              </div>

              <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" name="telefono" placeholder="0999123456">
              </div>

              <div class="form-group full-width">
                <label>Dirección</label>
                <input type="text" name="direccion" placeholder="Av. Principal 123">
              </div>

              <div class="form-group">
                <label>Ciudad</label>
                <input type="text" name="ciudad" placeholder="Quito">
              </div>

              <div class="form-group">
                <label>País</label>
                <input type="text" name="pais" value="Ecuador" placeholder="Ecuador">
              </div>

              <div class="form-group">
                <label>Tipo de cliente *</label>
                <select name="tipo_cliente" required>
                  <option value="minorista">Minorista</option>
                  <option value="mayorista">Mayorista</option>
                  <option value="corporativo">Corporativo</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display:flex; align-items:center; gap:0.5rem;">
                  <input type="checkbox" name="activo" checked>
                  <span>Cliente activo</span>
                </label>
              </div>

            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="pos-form-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" id="pos-form-save">
                💾 Guardar cliente
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  `;
}

export function initPOS() {
  console.log("🏪 Inicializando POS...");
  // La lógica se implementará en posLogic.js
}