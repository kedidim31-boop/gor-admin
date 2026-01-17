/* =========================================================
   GOR PRODUCT ADMIN – UI SYSTEM
   Header, Navigation, Auto-Logout
   ========================================================= */

function initPage() {
    requireLogin();
    loadHeader();
    checkAutoLogout();
    setInterval(checkAutoLogout, 30000); // alle 30 Sekunden prüfen
}

/* ---------------------------------------------------------
   HEADER LADEN
   --------------------------------------------------------- */
function loadHeader() {

    const session = getSession();
    const username = session ? session.user : "Unbekannt";

    const headerHTML = `
        <div class="header">

            <div class="header-left">
                <img src="assets/img/shoplogo_final_white.png" class="header-logo">
                <span class="header-title">GOR Admin</span>
            </div>

            <div class="header-nav">
                <a href="dashboard.html" class="nav-item">Dashboard</a>
                <a href="product-edit.html" class="nav-item">Produkt erstellen</a>
                <a href="audit-log.html" class="nav-item">Audit Log</a>
                <a href="settings.html" class="nav-item">Einstellungen</a>
            </div>

            <div class="header-right">
                <span class="user-pill">${username}</span>
                <button class="icon-btn" onclick="logout()">
                    🔒
                </button>
            </div>

        </div>
    `;

    document.getElementById("app-header").innerHTML = headerHTML;
}

/* ---------------------------------------------------------
   NAVIGATION HIGHLIGHT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");
    if (!page) return;

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        if (item.href.includes(page)) {
            item.classList.add("active");
        }
    });
});
