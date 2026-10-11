class AppNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="../css/global.css">
      <nav class="navbar">
          <div class="navbar-content">
              <img
                  src="../images/hub.png"
                  alt="Logo"
                  class="app-logo"
              />

              <span class="app-name">
                  Fiche technique de l'exemple bidon
              </span>
          </div>
      </nav>

      <!-- Floating navigation -->
      <nav class="floating-nav">

          <button class="nav-toggle" onclick="toggleMenu()">
              ☰ Navigation
          </button>

          <div class="nav-menu" id="navMenu">
              <a href="../">Tutoriel</a>
              <a href="../interactive_toolbox">Boite à outils</a>
          </div>

      </nav>
    `;
  }
}

customElements.define('app-nav', AppNav);