export function cargarFooter() {
  const footer = document.querySelector("footer#footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <p>© 2025 New Era Tech · Quito, Ecuador · Envíos a nivel nacional</p>
    </div>
  `;
}
