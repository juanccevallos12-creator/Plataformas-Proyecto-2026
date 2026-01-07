// /client/js/logic/checkoutLogic.js
import { leerCart, vaciarCarrito, calcularTotal } from "../state/cart.js";
import { getUser } from "../state/session.js";
import { getProductos } from "../api/productos.js";

// Estado del checkout
let checkoutState = {
  currentStep: 1,
  totalSteps: 5,
  shippingInfo: {},
  deliveryMethod: null,
  deliveryCost: 0,
  paymentMethod: null,
  paymentInfo: {}
};

let productosIndex = {}; // Cache de productos

// ============================================================
//                    INICIALIZACIÓN
// ============================================================
export async function initCheckout() {
  const cart = leerCart();
  
  if (!cart || cart.length === 0) {
    alert("Tu carrito está vacío");
    window.location.hash = "#/productos";
    return;
  }

  // Cargar productos para tener la info completa
  const productos = await getProductos().catch(() => []);
  productosIndex = Object.fromEntries(productos.map(p => [p.id, p]));

  // Renderizar paso 1
  renderStep(1);
  
  // Event listeners
  setupNavigationButtons();
}

// ============================================================
//                    RENDERIZADO DE PASOS
// ============================================================
function renderStep(step) {
  checkoutState.currentStep = step;
  updateStepper();
  updateButtons();
  
  const content = document.getElementById('checkout-content');
  const summary = document.getElementById('checkout-summary');
  
  if (!content || !summary) return;
  
  switch(step) {
    case 1:
      content.innerHTML = renderStep1_CartReview();
      break;
    case 2:
      content.innerHTML = renderStep2_ShippingInfo();
      setupShippingForm();
      break;
    case 3:
      content.innerHTML = renderStep3_DeliveryMethod();
      setupDeliveryOptions();
      break;
    case 4:
      content.innerHTML = renderStep4_Payment();
      setupPaymentForms();
      break;
    case 5:
      content.innerHTML = renderStep5_Confirmation();
      setupFinalConfirmation();
      break;
  }
  
  summary.innerHTML = renderOrderSummary();
}

// ============================================================
//                    PASO 1: REVISIÓN DEL CARRITO
// ============================================================
function renderStep1_CartReview() {
  const cart = leerCart();
  const { subtotal, items } = getCartDetails();
  
  return `
    <div class="checkout-step">
      <h2>📦 Revisión del Carrito</h2>
      <p class="text-muted">Verifica los productos antes de continuar</p>
      
      <div class="cart-items-list">
        ${items.map(item => `
          <div class="cart-item-card">
            <img src="${item.imagen}"
                 alt="${item.nombre}" 
                 class="item-image"
                 onerror="this.src='/assets/images/placeholder.jpg'">
            <div class="item-details">
              <h3>${item.nombre}</h3>
              <p class="text-muted">${item.descripcion || ''}</p>
            </div>
            <div class="item-quantity">
              <span>Cantidad:</span>
              <strong>${item.cantidad}</strong>
            </div>
            <div class="item-price">
              <span>Precio:</span>
              <strong>$${item.precio.toFixed(2)}</strong>
            </div>
            <div class="item-subtotal">
              <span>Subtotal:</span>
              <strong class="text-brand">$${(item.precio * item.cantidad).toFixed(2)}</strong>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="cart-total-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <strong>$${subtotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
//                    PASO 2: INFORMACIÓN DE ENVÍO
// ============================================================
function renderStep2_ShippingInfo() {
  return `
    <div class="checkout-step">
      <h2>📍 Información de Envío</h2>
      <p class="text-muted">¿Dónde deseas recibir tu pedido?</p>
      
      <form id="shipping-form" class="checkout-form">
        <div class="form-row">
          <div class="form-group">
            <label for="fullName">Nombre completo *</label>
            <input type="text" id="fullName" name="fullName" required 
                   placeholder="Juan Pérez" value="${checkoutState.shippingInfo.fullName || ''}">
          </div>
          
          <div class="form-group">
            <label for="phone">Teléfono *</label>
            <input type="tel" id="phone" name="phone" required 
                   placeholder="0999123456" value="${checkoutState.shippingInfo.phone || ''}">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required 
                   placeholder="correo@ejemplo.com" value="${checkoutState.shippingInfo.email || ''}">
          </div>
          
          <div class="form-group">
            <label for="idNumber">Cédula/RUC *</label>
            <input type="text" id="idNumber" name="idNumber" required 
                   placeholder="1234567890" value="${checkoutState.shippingInfo.idNumber || ''}">
          </div>
        </div>
        
        <div class="form-group">
          <label for="address">Dirección completa *</label>
          <textarea id="address" name="address" rows="3" required 
                    placeholder="Calle, número, sector, referencias">${checkoutState.shippingInfo.address || ''}</textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="city">Ciudad *</label>
            <select id="city" name="city" required>
              <option value="">Seleccione...</option>
              <option value="Quito" ${checkoutState.shippingInfo.city === 'Quito' ? 'selected' : ''}>Quito</option>
              <option value="Guayaquil" ${checkoutState.shippingInfo.city === 'Guayaquil' ? 'selected' : ''}>Guayaquil</option>
              <option value="Cuenca" ${checkoutState.shippingInfo.city === 'Cuenca' ? 'selected' : ''}>Cuenca</option>
              <option value="Otra" ${checkoutState.shippingInfo.city === 'Otra' ? 'selected' : ''}>Otra</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="postalCode">Código Postal</label>
            <input type="text" id="postalCode" name="postalCode" 
                   placeholder="170150" value="${checkoutState.shippingInfo.postalCode || ''}">
          </div>
        </div>
      </form>
    </div>
  `;
}

function setupShippingForm() {
  const user = getUser();
  if (user && Object.keys(checkoutState.shippingInfo).length === 0) {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    if (fullNameInput) fullNameInput.value = user.nombre || '';
    if (emailInput) emailInput.value = user.email || '';
  }
}

// ============================================================
//                    PASO 3: MÉTODO DE ENTREGA
// ============================================================
function renderStep3_DeliveryMethod() {
  return `
    <div class="checkout-step">
      <h2>🚚 Método de Entrega</h2>
      <p class="text-muted">Selecciona cómo deseas recibir tu pedido</p>
      
      <div class="delivery-options">
        <div class="delivery-option ${checkoutState.deliveryMethod === 'pickup' ? 'selected' : ''}" 
             data-method="pickup">
          <div class="option-icon">🏪</div>
          <div class="option-content">
            <h3>Retiro en Tienda</h3>
            <p>Retira tu pedido en nuestra tienda física</p>
            <p class="text-muted"><strong>Dirección:</strong> Quito, Ecuador</p>
            <p class="text-muted"><strong>Horario:</strong> Lun-Vie 9:00-18:00</p>
          </div>
          <div class="option-price">
            <strong class="text-ok">GRATIS</strong>
          </div>
        </div>
        
        <div class="delivery-option ${checkoutState.deliveryMethod === 'delivery' ? 'selected' : ''}" 
             data-method="delivery">
          <div class="option-icon">📦</div>
          <div class="option-content">
            <h3>Envío a Domicilio</h3>
            <p>Envío a nivel nacional</p>
            <p class="text-muted"><strong>Tiempo:</strong> 2-5 días hábiles</p>
          </div>
          <div class="option-price">
            <strong class="text-brand">$5.00</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupDeliveryOptions() {
  const options = document.querySelectorAll('.delivery-option');
  
  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      const method = option.dataset.method;
      checkoutState.deliveryMethod = method;
      checkoutState.deliveryCost = method === 'delivery' ? 5.00 : 0;
      
      document.getElementById('checkout-summary').innerHTML = renderOrderSummary();
    });
  });
}

// ============================================================
//                    PASO 4: MÉTODO DE PAGO
// ============================================================
function renderStep4_Payment() {
  return `
    <div class="checkout-step">
      <h2>💳 Método de Pago</h2>
      <p class="text-muted">Selecciona cómo deseas pagar</p>
      
      <div class="payment-methods">
        <div class="payment-method ${checkoutState.paymentMethod === 'card' ? 'selected' : ''}" data-method="card">
          <input type="radio" name="paymentMethod" id="payment-card" value="card" 
                 ${checkoutState.paymentMethod === 'card' ? 'checked' : ''}>
          <label for="payment-card">
            <div class="method-header">
              <span class="method-icon">💳</span>
              <span class="method-name">Tarjeta de Crédito/Débito</span>
            </div>
          </label>
        </div>
        
        <div class="payment-method ${checkoutState.paymentMethod === 'transfer' ? 'selected' : ''}" data-method="transfer">
          <input type="radio" name="paymentMethod" id="payment-transfer" value="transfer" 
                 ${checkoutState.paymentMethod === 'transfer' ? 'checked' : ''}>
          <label for="payment-transfer">
            <div class="method-header">
              <span class="method-icon">🏦</span>
              <span class="method-name">Transferencia Bancaria</span>
            </div>
          </label>
        </div>
      </div>
      
      <div id="card-form-container" class="payment-form-container" 
           style="display: ${checkoutState.paymentMethod === 'card' ? 'block' : 'none'}">
        <form id="card-form" class="checkout-form">
          <h3>Datos de la Tarjeta (Simulación)</h3>
          <div class="alert alert-info">
            ℹ️ Esta es una simulación. No se procesará ningún pago real.
          </div>
          <div class="form-group">
            <label for="cardNumber">Número de Tarjeta *</label>
            <input type="text" id="cardNumber" name="cardNumber" required 
                   placeholder="4532 1234 5678 9010" maxlength="19" 
                   value="${checkoutState.paymentInfo.cardNumber || ''}">
          </div>
          
          <div class="form-group">
            <label for="cardName">Nombre del Titular *</label>
            <input type="text" id="cardName" name="cardName" required 
                   placeholder="JUAN PEREZ" value="${checkoutState.paymentInfo.cardName || ''}">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="cardExpiry">Expiración *</label>
              <input type="text" id="cardExpiry" name="cardExpiry" required 
                     placeholder="12/28" maxlength="5" 
                     value="${checkoutState.paymentInfo.cardExpiry || ''}">
            </div>
            
            <div class="form-group">
              <label for="cardCVV">CVV *</label>
              <input type="text" id="cardCVV" name="cardCVV" required 
                     placeholder="123" maxlength="4" 
                     value="${checkoutState.paymentInfo.cardCVV || ''}">
            </div>
          </div>
        </form>
      </div>
      
      <div id="transfer-info-container" class="payment-form-container" 
           style="display: ${checkoutState.paymentMethod === 'transfer' ? 'block' : 'none'}">
        <div class="transfer-info">
          <h3>Instrucciones de Transferencia</h3>
          <div class="bank-info-card">
            <div class="bank-details">
              <p><strong>Banco:</strong> Banco Pichincha</p>
              <p><strong>Cuenta:</strong> 2100123456</p>
              <p><strong>Titular:</strong> New Era Tech</p>
              <p><strong>RUC:</strong> 1234567890001</p>
            </div>
          </div>
          <div class="alert alert-info">
            ℹ️ Envía el comprobante a: pagos@neweratech.com
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupPaymentForms() {
  const methods = document.querySelectorAll('.payment-method');
  const cardForm = document.getElementById('card-form-container');
  const transferInfo = document.getElementById('transfer-info-container');
  
  methods.forEach(method => {
    method.addEventListener('click', () => {
      const selectedMethod = method.dataset.method;
      checkoutState.paymentMethod = selectedMethod;
      
      methods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      method.querySelector('input[type="radio"]').checked = true;
      
      if (selectedMethod === 'card') {
        cardForm.style.display = 'block';
        transferInfo.style.display = 'none';
      } else {
        cardForm.style.display = 'none';
        transferInfo.style.display = 'block';
      }
    });
  });
  
  // Formateo de tarjeta
  const cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
  
  const cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
}

// ============================================================
//                    PASO 5: CONFIRMACIÓN
// ============================================================
function renderStep5_Confirmation() {
  const { subtotal, items } = getCartDetails();
  const total = subtotal + checkoutState.deliveryCost;
  
  return `
    <div class="checkout-step">
      <h2>✅ Confirmar Pedido</h2>
      <p class="text-muted">Revisa toda la información antes de confirmar</p>
      
      <div class="confirmation-sections">
        <div class="confirmation-section">
          <h3>📦 Productos (${items.length})</h3>
          <div class="confirmation-items">
            ${items.map(item => `
              <div class="confirmation-item">
                <span>${item.nombre} x ${item.cantidad}</span>
                <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="confirmation-section">
          <h3>📍 Información de Envío</h3>
          <p><strong>Nombre:</strong> ${checkoutState.shippingInfo.fullName}</p>
          <p><strong>Teléfono:</strong> ${checkoutState.shippingInfo.phone}</p>
          <p><strong>Email:</strong> ${checkoutState.shippingInfo.email}</p>
          <p><strong>Dirección:</strong> ${checkoutState.shippingInfo.address}, ${checkoutState.shippingInfo.city}</p>
        </div>
        
        <div class="confirmation-section">
          <h3>🚚 Método de Entrega</h3>
          <p>
            ${checkoutState.deliveryMethod === 'pickup' ? 
              '🏪 Retiro en Tienda - GRATIS' : 
              '📦 Envío a Domicilio - $5.00'}
          </p>
        </div>
        
        <div class="confirmation-section">
          <h3>💳 Método de Pago</h3>
          <p>
            ${checkoutState.paymentMethod === 'card' ? 
              `💳 Tarjeta (simulación) terminada en ${checkoutState.paymentInfo.cardNumber?.slice(-4) || '****'}` : 
              '🏦 Transferencia Bancaria'}
          </p>
        </div>
        
        <div class="confirmation-total">
          <div class="total-row">
            <span>Subtotal:</span>
            <strong>$${subtotal.toFixed(2)}</strong>
          </div>
          <div class="total-row">
            <span>Envío:</span>
            <strong>${checkoutState.deliveryCost === 0 ? 'GRATIS' : '$' + checkoutState.deliveryCost.toFixed(2)}</strong>
          </div>
          <div class="total-row final">
            <span>TOTAL:</span>
            <strong class="text-brand">$${total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div class="confirmation-terms">
          <label class="checkbox-label">
            <input type="checkbox" id="accept-terms" required>
            <span>Acepto los términos y condiciones</span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function setupFinalConfirmation() {
  // Ya está en el HTML
}

// ============================================================
//                    RESUMEN DEL PEDIDO (SIDEBAR)
// ============================================================
function renderOrderSummary() {
  const { subtotal, items } = getCartDetails();
  const total = subtotal + checkoutState.deliveryCost;
  
  return `
    <div class="summary-card">
      <h3>Resumen del Pedido</h3>
      
      <div class="summary-items">
        ${items.slice(0, 3).map(item => `
          <div class="summary-item">
            <span>${item.nombre} x${item.cantidad}</span>
            <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
          </div>
        `).join('')}
        ${items.length > 3 ? `<p class="text-muted" style="margin-top:0.5rem;">... y ${items.length - 3} más</p>` : ''}
      </div>
      
      <div class="summary-totals">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Envío:</span>
          <span>${checkoutState.deliveryCost === 0 ? 'GRATIS' : '$' + checkoutState.deliveryCost.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <strong>Total:</strong>
          <strong class="text-brand">$${total.toFixed(2)}</strong>
        </div>
      </div>
      
      <div class="summary-security">
        🔒 Compra segura
      </div>
    </div>
  `;
}

// ============================================================
//                    NAVEGACIÓN
// ============================================================
function setupNavigationButtons() {
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  
  if (!btnPrev || !btnNext) return;
  
  btnPrev.addEventListener('click', () => {
    if (checkoutState.currentStep === 1) {
      window.location.hash = '#/carrito';
    } else if (checkoutState.currentStep > 1) {
      renderStep(checkoutState.currentStep - 1);
    }
  });
  
  btnNext.addEventListener('click', () => {
    if (validateCurrentStep()) {
      if (checkoutState.currentStep < checkoutState.totalSteps) {
        renderStep(checkoutState.currentStep + 1);
      } else {
        createOrder();
      }
    }
  });
}

function updateButtons() {
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  
  if (!btnPrev || !btnNext) return;
  
  if (checkoutState.currentStep === 1) {
    btnPrev.textContent = '🛒 Volver al Carrito';
  } else {
    btnPrev.textContent = '← Anterior';
  }
  
  if (checkoutState.currentStep === checkoutState.totalSteps) {
    btnNext.textContent = '✅ Confirmar Pedido';
    btnNext.classList.add('btn-success');
  } else {
    btnNext.textContent = 'Continuar →';
    btnNext.classList.remove('btn-success');
  }
}

function updateStepper() {
  const steps = document.querySelectorAll('.stepper-step');
  
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    
    if (stepNumber < checkoutState.currentStep) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNumber === checkoutState.currentStep) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
}

// ============================================================
//                    VALIDACIÓN
// ============================================================
function validateCurrentStep() {
  switch(checkoutState.currentStep) {
    case 1:
      return true;
      
    case 2:
      const form = document.getElementById('shipping-form');
      if (!form || !form.checkValidity()) {
        form?.reportValidity();
        return false;
      }
      const formData = new FormData(form);
      checkoutState.shippingInfo = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        idNumber: formData.get('idNumber'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      };
      return true;
      
    case 3:
      if (!checkoutState.deliveryMethod) {
        alert('Selecciona un método de entrega');
        return false;
      }
      return true;
      
    case 4:
      if (!checkoutState.paymentMethod) {
        alert('Selecciona un método de pago');
        return false;
      }
      if (checkoutState.paymentMethod === 'card') {
        const cardForm = document.getElementById('card-form');
        if (!cardForm || !cardForm.checkValidity()) {
          cardForm?.reportValidity();
          return false;
        }
        const cardData = new FormData(cardForm);
        checkoutState.paymentInfo = {
          cardNumber: cardData.get('cardNumber'),
          cardName: cardData.get('cardName'),
          cardExpiry: cardData.get('cardExpiry'),
          cardCVV: cardData.get('cardCVV')
        };
      }
      return true;
      
    case 5:
      const termsCheckbox = document.getElementById('accept-terms');
      if (!termsCheckbox || !termsCheckbox.checked) {
        alert('Debes aceptar los términos y condiciones');
        return false;
      }
      return true;
      
    default:
      return false;
  }
}

// ============================================================
//                    CREAR PEDIDO
// ============================================================
async function createOrder() {
  const btnNext = document.getElementById('btn-next-step');
  if (btnNext) {
    btnNext.disabled = true;
    btnNext.textContent = '⏳ Procesando...';
  }
  
  try {
    const { subtotal, items } = getCartDetails();
    const total = subtotal + checkoutState.deliveryCost;
    const user = getUser();
    
    const orderData = {
      usuarioId: user?.id || 'guest',
      items: items.map(item => ({
        productoId: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      shippingInfo: checkoutState.shippingInfo,
      deliveryMethod: checkoutState.deliveryMethod,
      deliveryCost: checkoutState.deliveryCost,
      paymentMethod: checkoutState.paymentMethod,
      subtotal,
      total,
      estado: 'pendiente'
    };
    
    // Simular creación de pedido
    console.log('Pedido a crear:', orderData);
    
    // Vaciar carrito
    vaciarCarrito();
    
    // Mostrar éxito
    showSuccessMessage({
      id: 'PED-' + Date.now(),
      total
    });
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el pedido');
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.textContent = '✅ Confirmar Pedido';
    }
  }
}

function showSuccessMessage(order) {
  const content = document.getElementById('checkout-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="success-message">
      <div class="success-icon">🎉</div>
      <h2>¡Pedido Creado Exitosamente!</h2>
      <p class="order-number">Número de pedido: <strong>${order.id}</strong></p>
      
      <div class="success-details">
        <div class="alert alert-success">
          ✅ Tu pedido ha sido registrado<br>
          📧 Recibirás un email con los detalles
        </div>
        
        <p style="margin-top:1.5rem;">Total: <strong class="text-brand">$${order.total.toFixed(2)}</strong></p>
      </div>
      
      <div class="success-actions">
        <a href="#/productos" class="btn btn-primary">Seguir Comprando</a>
        <a href="#/" class="btn btn-secondary">Volver al Inicio</a>
      </div>
    </div>
  `;
  
  document.querySelector('.checkout-actions').style.display = 'none';
}

// ============================================================
//                    UTILIDADES
// ============================================================
function getCartDetails() {
  const cart = leerCart();
  const items = cart.map(item => {
    const producto = productosIndex[item.id] || {};
    return {
      id: item.id,
      nombre: producto.nombre || 'Producto',
      descripcion: producto.descripcion || '',
      precio: producto.precio || item.precio || 0,
      cantidad: item.qty || item.cantidad || 1,
      imagen: producto.imagen || '/assets/images/placeholder.jpg'
    };
  });
  
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  return { items, subtotal };
}