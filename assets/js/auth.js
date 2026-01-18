// auth.js – zentrale Authentifizierung und Footer-Logik

// Logout-Funktion
function handleLogout() {
  localStorage.removeItem("loggedInUser");
  alert("Du wurdest abgemeldet.");
  window.location.href = "login.html";
}

// Login-Check für geschützte Seiten
function checkAuth() {
  const currentUser = localStorage.getItem("loggedInUser");
  if (!currentUser) {
    alert("Bitte zuerst einloggen!");
    window.location.href = "login.html";
  }
}

// Footer automatisch aktualisieren
function updateFooter() {
  const footerText = document.getElementById("footerText");
  if (footerText) {
    const currentUser = localStorage.getItem("loggedInUser") || "Gast";
    const now = new Date();
    const timestamp = now.toLocaleString("de-DE");
    footerText.textContent = `Angemeldet als: ${currentUser} | Stand: ${timestamp}`;
  }
}

// Beim Laden der Seite ausführen
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  updateFooter();
});
