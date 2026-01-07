// client/js/views/CheckoutView.js
import { initCheckout } from "../logic/checkoutLogic.js";

export function CheckoutView() {
  return `
    <div class="checkout-page">
      <!-- STEPPER (Indicador de pasos) -->
      <div class="stepper-container">
        <div class="stepper">
          <div class="stepper-step active" data-step="1">
            <div class="step-number">1</div>
            <div class="step-label">Carrito</div>
          </div>
          <div class="stepper-line"></div>
          <div class="stepper-step" data-step="2">
            <div class="step-number">2</div>
            <div class="step-label">Envío</div>
          </div>
          <div class="stepper-line"></div>
          <div class="stepper-step" data-step="3">
            <div class="step-number">3</div>
            <div class="step-label">Entrega</div>
          </div>
          <div class="stepper-line"></div>
          <div class="stepper-step" data-step="4">
            <div class="step-number">4</div>
            <div class="step-label">Pago</div>
          </div>
          <div class="stepper-line"></div>
          <div class="stepper-step" data-step="5">
            <div class="step-number">5</div>
            <div class="step-label">Confirmar</div>
          </div>
        </div>
      </div>

      <div class="checkout-container">
        <!-- CONTENIDO PRINCIPAL (cambia según el paso) -->
        <div class="checkout-main">
          <div id="checkout-content">
            <!-- Aquí se renderiza cada paso -->
          </div>

          <!-- BOTONES DE NAVEGACIÓN -->
          <div class="checkout-actions">
            <button id="btn-prev-step" class="btn btn-secondary">
              ← Anterior
            </button>
            <button id="btn-next-step" class="btn btn-primary">
              Continuar →
            </button>
          </div>
        </div>

        <!-- RESUMEN LATERAL (sidebar) -->
        <aside class="checkout-sidebar">
          <div id="checkout-summary">
            <!-- Resumen del pedido -->
          </div>
        </aside>
      </div>
    </div>
  `;
}

export async function initCheckoutView() {
  await initCheckout();
}