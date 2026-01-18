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

          <form id="pos-form-new-client" class="pos-form" novalidate>
            <div class="form-grid">
              
              <!-- Tipo de documento: Cédula o RUC -->
              <div class="form-group full-width">
                <div class="documento-tipo-selector">
                  <label class="radio-option">
                    <input type="radio" name="tipo_documento" value="cedula" checked>
                    <span>🪪 Cédula (10 dígitos)</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" name="tipo_documento" value="ruc">
                    <span>🏢 RUC (13 dígitos)</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label>Cédula / RUC *</label>
                <input type="text" name="id" required placeholder="1234567890" 
                       maxlength="13" inputmode="numeric" autocomplete="off">
                <span class="field-error" id="error-id"></span>
                <span class="field-hint" id="hint-id">Ingrese 10 dígitos para cédula</span>
              </div>

              <div class="form-group">
                <label>Nombre completo *</label>
                <input type="text" name="nombre" required placeholder="Juan Pérez" autocomplete="off">
                <span class="field-error" id="error-nombre"></span>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="cliente@email.com" autocomplete="off">
                <span class="field-error" id="error-email"></span>
              </div>

              <div class="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" placeholder="0999123456" 
                       maxlength="10" inputmode="numeric" autocomplete="off">
                <span class="field-error" id="error-telefono"></span>
              </div>

              <div class="form-group full-width">
                <label>Dirección</label>
                <input type="text" name="direccion" placeholder="Av. Principal 123" autocomplete="off">
              </div>

              <div class="form-group">
                <label>País *</label>
                <select name="pais" id="select-pais" required>
                  <option value="">Seleccione un país...</option>
                </select>
                <span class="field-error" id="error-pais"></span>
              </div>

              <div class="form-group">
                <label>Ciudad *</label>
                <select name="ciudad" id="select-ciudad" required disabled>
                  <option value="">Primero seleccione un país...</option>
                </select>
                <span class="field-error" id="error-ciudad"></span>
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
                <label class="checkbox-label">
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

// ← ESTA FUNCIÓN DEBE IMPORTAR LA LÓGICA
export async function initPOS() {
  console.log("🏪 Inicializando POS...");
  
  // Importar dinámicamente la lógica
  const { initPOS: initPOSLogic } = await import('../logic/posLogic.js');
  initPOSLogic();
}