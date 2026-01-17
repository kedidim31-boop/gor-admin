/* =========================================================
   GOR PRODUCT ADMIN – INDEX SCRIPT
   Zentrale Initialisierung aller Module
   ========================================================= */

/* ---------------------------------------------------------
   INIT SYSTEM
   --------------------------------------------------------- */
function initSystem() {
    logInfo("system_init", "System wird initialisiert...");

    // Session prüfen
    const session = getSession();
    if (!session || !session.user) {
        logWarn("session_missing", "Keine aktive Session gefunden → Weiterleitung zum Login.");
        window.location.href = "index.html";
        return;
    }

    // Avatar laden
    loadUserAvatar();

    // Benutzerliste laden (falls Settings-Seite)
    if (document.getElementById("user-list")) {
        loadUserList();
    }

    // Dashboard laden (falls Dashboard-Seite)
    if (document.getElementById("dashboard")) {
        loadDashboardKPIs();
    }

    // Aktivitäten laden (falls Activity-Seite)
    if (document.getElementById("activity-list")) {
        loadActivities();
    }

    // Audit laden (falls Audit-Seite)
    if (document.getElementById("audit-table")) {
        loadAuditLog();
    }

    // KPIs laden (falls KPI-Seite)
    if (document.getElementById("kpi-products")) {
        loadKPI();
    }

    // Notifications Beispiel
    showNotification(`Willkommen zurück, ${session.user}`, "success", 4000);

    logInfo("system_ready", "System erfolgreich gestartet.");
}

/* ---------------------------------------------------------
   GLOBAL EVENTS
   --------------------------------------------------------- */
function initGlobalEvents() {
    // Logout-Button
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logout();
            showToast("Du wurdest ausgeloggt", "info");
        });
    }

    // Dropdown Avatar
    const avatar = document.querySelector(".header-user");
    if (avatar) {
        avatar.addEventListener("click", toggleUserDropdown);
    }
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initSystem();
    initGlobalEvents();
});
