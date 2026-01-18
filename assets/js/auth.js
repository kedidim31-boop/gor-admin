// auth.js – Zentrales Authentifizierungssystem

(function() {
  const currentPage = window.location.pathname.split("/").pop();

  // Wenn User nicht eingeloggt ist → Redirect zu login.html
  if (currentPage !== "login.html") {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      window.location.href = "login.html";
    }
  }

  // Logout-Funktion global verfügbar machen
  window.handleLogout = function() {
    localStorage.removeItem("loggedInUser");
    alert("Du wurdest abgemeldet.");
    window.location.href = "login.html";
  };

  // Footer automatisch aktualisieren
  window.updateFooter = function() {
    const year = new Date().getFullYear();
    const footerText = document.getElementById("footerText");
    if (footerText) {
      footerText.textContent = `© ${year} Gaming of Republic - Alle Rechte vorbehalten.`;
    }
  };

  // Footer sofort setzen
  window.updateFooter();
})();
