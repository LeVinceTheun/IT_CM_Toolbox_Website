
function toggleMenu() {

    const menu = document.getElementById("navMenu");

    menu.classList.toggle("show");
}

class AppNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="../css/global.css">
      <nav class="navbar">
          <div class="navbar-content">
              <img src="../images/hub.png" alt="Logo" class="app-logo" />
              <span class="app-name">Fiche technique de l'exemple bidon</span>
          </div>
      </nav>

      <nav class="floating-nav">
          <button class="nav-toggle" id="navToggleBtn">
              ☰ Navigation
          </button>

          <div class="nav-menu" id="navMenu">
              <a href="../">Tutoriel</a>
              <a href="../interactive_toolbox">Boite à outils</a>
          </div>
      </nav>
    `;

    const toggleBtn = this.querySelector('#navToggleBtn');
    const navMenu = this.querySelector('#navMenu');

    toggleBtn.addEventListener('click', () => {
      console.log('Button clicked!'); // Check if this prints in F12 console
      navMenu.classList.toggle('active');
    });
  }
}

customElements.define('app-nav', AppNav);

