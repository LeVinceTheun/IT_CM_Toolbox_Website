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
          <!-- Removed inline onclick -->
          <button class="nav-toggle" id="navToggleBtn">
              ☰ Navigation
          </button>

          <div class="nav-menu" id="navMenu">
              <a href="../">Tutoriel</a>
              <a href="../interactive_toolbox">Boite à outils</a>
          </div>
      </nav>
    `;

    // Attach click listener directly within the component
    const toggleBtn = this.querySelector('#navToggleBtn');
    const navMenu = this.querySelector('#navMenu');

    // Debugging test
    toggleBtn.addEventListener('click', () => {
      console.log("Button was clicked!");
      navMenu.classList.toggle('show');
      console.log("Current menu classes:", navMenu.className);
    });
  }
}

customElements.define('app-nav', AppNav);