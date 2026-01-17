/* =========================================================
   GOR DASHBOARD – KPI + ACTIVITY LOADER
   ========================================================= */

/* ---------------------------------------------------------
   HELPER: Datum/Zeit formatieren
   --------------------------------------------------------- */
function formatDateTime(timestamp) {
    try {
        return new Date(timestamp).toLocaleString("de-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (e) {
        return timestamp;
    }
}

/* ---------------------------------------------------------
   PRODUKTE LADEN
   --------------------------------------------------------- */
function getProducts() {
    return JSON.parse(localStorage.getItem("gor_products") || "[]");
}

/* ---------------------------------------------------------
   AUDIT LOG LADEN
   --------------------------------------------------------- */
function getAuditLog() {
    return JSON.parse(localStorage.getItem("gor_audit") || "[]");
}

/* ---------------------------------------------------------
   KPI LADEN
   --------------------------------------------------------- */
function loadDashboardKPIs() {
    const products = getProducts();
    const audit = getAuditLog();

    // KPIs
    const kpiProducts = document.getElementById("kpi-products");
    const kpiSaves = document.getElementById("kpi-saves");
    const kpiDeletes = document.getElementById("kpi-deletes");
    const kpiLogins = document.getElementById("kpi-logins");

    if (kpiProducts) kpiProducts.innerText = products.length;
    if (kpiSaves) kpiSaves.innerText = audit.filter(a => a.type === "product_save").length;
    if (kpiDeletes) kpiDeletes.innerText = audit.filter(a => a.type === "product_delete").length;
    if (kpiLogins) kpiLogins.innerText = audit.filter(a => a.type === "login_success").length;

    // Recent Activity
    const container = document.getElementById("recent-activity");
    if (!container) return;

    const recent = audit.slice(-6).reverse();
    container.innerHTML = "";

    recent.forEach(entry => {
        const div = document.createElement("div");
        div.className = "recent-activity-item";

        div.innerHTML = `
            <strong>${entry.user}</strong> – ${entry.type}<br>
            <span style="opacity:0.7">${formatDateTime(entry.timestamp)}</span>
        `;

        container.appendChild(div);
    });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardKPIs();
});
