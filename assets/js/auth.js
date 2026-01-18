(function() {
  // Aktuelle Seite ermitteln
  const currentPage = window.location.pathname.split("/").pop();

  // Nur Login-Seite darf ohne Session geöffnet werden
  if (currentPage !== "login.html") {
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

  // Footer aktualisieren
  window.updateFooter = function() {
    const year = new Date().getFullYear();
    const footerText = document.getElementById("footerText");
    if (footerText) {
      footerText.textContent = `© ${year} Gaming of Republic – Alle Rechte vorbehalten.`;
    }
  };

  // Footer sofort setzen
  window.updateFooter();
})();
