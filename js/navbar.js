
function toggleMenu() {

    const menu = document.getElementById("navMenu");

    menu.classList.toggle("show");
}

class AppNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar">
          <div class="navbar-content">
              <img src="../images/hub.png" alt="Logo" class="app-logo" />
              <span class="app-name">Fiche technique de l'exemple bidon</span>
          </div>
      </nav>

      <nav class="floating-nav">
          <button class="nav-toggle" id="navToggleBtn" type="button">
              ☰ Navigation
          </button>

          <div class="nav-menu" id="navMenu">
              <a href="../">Tutoriel</a>
              <a href="../interactive_toolbox">Boite à outils</a>
          </div>
      </nav>
    `;

    // Target elements scoped strictly inside this component
    const toggleBtn = this.querySelector('#navToggleBtn');
    const navMenu = this.querySelector('#navMenu');

    toggleBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevents instant closing
      navMenu.classList.toggle('show');
      console.log("Toggled! Current classes:", navMenu.className);
    });

    // Close the menu if you click anywhere else on the page
    document.addEventListener('click', () => {
      navMenu.classList.remove('show');
    });
  }
}

customElements.define('app-nav', AppNav);

