import { renderLogin } from "../logic/loginLogic.js";

export function LoginView(){
  return `
    <main class="login-wrapper">
      <section class="login-card">

        <div class="login-header">
          <h1>Bienvenido de nuevo</h1>
          <p>Accede a tu cuenta para continuar con tus compras.</p>
        </div>

        <form id="form-login" novalidate>
          <div class="form-group">
            <label for="l-email">Correo electrónico</label>
            <input id="l-email" type="email" required>
          </div>

          <div class="form-group">
            <label for="l-pass">Contraseña</label>
            <input id="l-pass" type="password" minlength="6" required>
          </div>

          <button class="btn-login">Iniciar sesión</button>
          <p id="l-estado" class="estado"></p>
        </form>

        <footer class="login-footer">
          <p><a href="#/">Volver al inicio</a></p>
        </footer>

      </section>
    </main>
  `;
}

export function initLogin(){
  renderLogin();
}
