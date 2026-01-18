(function() {
  // Aktuelle Seite ermitteln
  const currentPage = window.location.pathname.split("/").pop();

  // Wenn nicht Login-Seite → prüfen ob User eingeloggt ist
  if (currentPage !== "login.html" && currentPage !== "register.html") {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      window.location.href = "login.html";
    }
  }

  // Logout-Funktion
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
