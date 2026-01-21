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

      <!-- Modal: Pago con Tarjeta -->
      <div id="pos-modal-tarjeta" class="modal">
        <div class="modal-content modal-pago">
          <div class="modal-header">
            <h2>💳 Pago con Tarjeta</h2>
            <button class="modal-close" id="modal-tarjeta-close">✕</button>
          </div>

          <form id="form-pago-tarjeta" class="pago-form">
            <!-- Logos de tarjetas -->
            <div class="tarjetas-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" class="logo-tarjeta">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" class="logo-tarjeta">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="American Express" class="logo-tarjeta">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Diners_Club_Logo3.svg/200px-Diners_Club_Logo3.svg.png" alt="Diners Club" class="logo-tarjeta">
            </div>

            <!-- Tipo de pago -->
            <div class="form-group">
              <label>Tipo de Pago *</label>
              <select name="tipo_pago" id="tipo-pago-tarjeta" required>
                <option value="contado">Contado (1 pago)</option>
                <option value="diferido_3">Diferido 3 meses (con interés)</option>
                <option value="diferido_6">Diferido 6 meses (con interés)</option>
                <option value="diferido_9">Diferido 9 meses (con interés)</option>
                <option value="diferido_12">Diferido 12 meses (con interés)</option>
                <option value="sin_interes_3">3 meses sin interés</option>
                <option value="sin_interes_6">6 meses sin interés</option>
              </select>
            </div>

            <!-- Info de cuotas -->
            <div class="info-cuotas" id="info-cuotas">
              <div class="cuota-detalle">
                <span class="cuota-label">Monto total:</span>
                <span class="cuota-valor" id="cuota-total">$0.00</span>
              </div>
              <div class="cuota-detalle" id="cuota-mensual-container" style="display:none;">
                <span class="cuota-label">Cuota mensual:</span>
                <span class="cuota-valor" id="cuota-mensual">$0.00</span>
              </div>
            </div>

            <!-- Simulación de tarjeta visual -->
            <div class="tarjeta-preview">
              <div class="tarjeta-chip"></div>
              <div class="tarjeta-numero" id="preview-numero">•••• •••• •••• ••••</div>
              <div class="tarjeta-info-row">
                <div class="tarjeta-nombre" id="preview-nombre">NOMBRE DEL TITULAR</div>
                <div class="tarjeta-vence" id="preview-vence">MM/AA</div>
              </div>
            </div>

            <!-- Campos de tarjeta -->
            <div class="form-group">
              <label>Número de Tarjeta *</label>
              <input type="text" name="numero_tarjeta" id="numero-tarjeta" 
                     placeholder="1234 5678 9012 3456" maxlength="19" 
                     inputmode="numeric" autocomplete="cc-number" required>
            </div>

            <div class="form-group">
              <label>Nombre del Titular *</label>
              <input type="text" name="nombre_titular" id="nombre-titular" 
                     placeholder="Como aparece en la tarjeta" 
                     autocomplete="cc-name" required style="text-transform: uppercase;">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Vencimiento *</label>
                <input type="text" name="vencimiento" id="vencimiento-tarjeta" 
                       placeholder="MM/AA" maxlength="5" 
                       inputmode="numeric" autocomplete="cc-exp" required>
              </div>
              <div class="form-group">
                <label>CVV *</label>
                <input type="password" name="cvv" id="cvv-tarjeta" 
                       placeholder="•••" maxlength="4" 
                       inputmode="numeric" autocomplete="cc-csc" required>
              </div>
            </div>

            <!-- Mensaje de seguridad -->
            <div class="seguridad-mensaje">
              <span class="icono-candado">🔒</span>
              <span>Pago seguro. Tus datos están protegidos.</span>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="btn-cancelar-tarjeta">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" id="btn-procesar-tarjeta">
                💳 Procesar Pago
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Pago por Transferencia -->
      <div id="pos-modal-transferencia" class="modal">
        <div class="modal-content modal-pago">
          <div class="modal-header">
            <h2>🏦 Pago por Transferencia</h2>
            <button class="modal-close" id="modal-transferencia-close">✕</button>
          </div>

          <form id="form-pago-transferencia" class="pago-form">
            <!-- Info de cuenta destino -->
            <div class="cuenta-destino">
              <h3>📋 Datos para Transferencia</h3>
              <div class="cuenta-info">
                <div class="cuenta-row">
                  <span class="cuenta-label">Banco:</span>
                  <span class="cuenta-valor">Banco Pichincha</span>
                </div>
                <div class="cuenta-row">
                  <span class="cuenta-label">Tipo de Cuenta:</span>
                  <span class="cuenta-valor">Corriente</span>
                </div>
                <div class="cuenta-row">
                  <span class="cuenta-label">Número:</span>
                  <span class="cuenta-valor">2100123456</span>
                  <button type="button" class="btn-copiar" onclick="navigator.clipboard.writeText('2100123456'); this.textContent='✓'; setTimeout(() => this.textContent='📋', 1500);">📋</button>
                </div>
                <div class="cuenta-row">
                  <span class="cuenta-label">Nombre:</span>
                  <span class="cuenta-valor">New Era Tech S.A.</span>
                </div>
                <div class="cuenta-row">
                  <span class="cuenta-label">RUC:</span>
                  <span class="cuenta-valor">1791234567001</span>
                </div>
              </div>
            </div>

            <div class="separador-pago">
              <span>Registrar Comprobante</span>
            </div>

            <!-- Banco origen -->
            <div class="form-group">
              <label>Banco de Origen *</label>
              <select name="banco_origen" id="banco-origen" required>
                <option value="">Seleccione el banco...</option>
                <option value="pichincha">Banco Pichincha</option>
                <option value="guayaquil">Banco de Guayaquil</option>
                <option value="pacifico">Banco del Pacífico</option>
                <option value="produbanco">Produbanco</option>
                <option value="internacional">Banco Internacional</option>
                <option value="bolivariano">Banco Bolivariano</option>
                <option value="austro">Banco del Austro</option>
                <option value="loja">Banco de Loja</option>
                <option value="machala">Banco de Machala</option>
                <option value="solidario">Banco Solidario</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <!-- Número de comprobante -->
            <div class="form-group">
              <label>Número de Comprobante *</label>
              <input type="text" name="numero_comprobante" id="numero-comprobante" 
                     placeholder="Ej: 123456789" required>
            </div>

            <!-- Fecha de transferencia -->
            <div class="form-group">
              <label>Fecha de Transferencia *</label>
              <input type="date" name="fecha_transferencia" id="fecha-transferencia" required>
            </div>

            <!-- Monto transferido -->
            <div class="form-group">
              <label>Monto Transferido *</label>
              <input type="number" name="monto_transferencia" id="monto-transferencia" 
                     placeholder="0.00" step="0.01" min="0.01" required>
              <span class="field-hint">Debe coincidir con el total: <strong id="total-a-pagar">$0.00</strong></span>
            </div>

            <!-- Nombre del titular -->
            <div class="form-group">
              <label>Nombre del Titular de la Cuenta</label>
              <input type="text" name="titular_cuenta" id="titular-cuenta" 
                     placeholder="Nombre de quien realizó la transferencia">
            </div>

            <!-- Observaciones -->
            <div class="form-group">
              <label>Observaciones</label>
              <textarea name="observaciones" id="observaciones-transferencia" 
                        placeholder="Notas adicionales..." rows="2"></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="btn-cancelar-transferencia">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" id="btn-registrar-transferencia">
                🏦 Registrar Pago
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