/* =========================================================
   GOR DASHBOARD – KPI + ACTIVITY LOADER
   ========================================================= */

function loadDashboardKPIs() {
    const products = getProducts();
    const audit = getAuditLog();

    // KPIs
    document.getElementById("kpi-products").innerText = products.length;
    document.getElementById("kpi-saves").innerText = audit.filter(a => a.type === "product_save").length;
    document.getElementById("kpi-deletes").innerText = audit.filter(a => a.type === "product_delete").length;
    document.getElementById("kpi-logins").innerText = audit.filter(a => a.type === "login_success").length;

    // Recent Activity
    const recent = audit.slice(-6).reverse();
    const container = document.getElementById("recent-activity");

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
