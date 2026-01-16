/* =========================================================
   GOR PRODUCT ADMIN – KPI SCRIPT
   Lädt Produkt-, Benutzer- und Audit-Statistiken
   ========================================================= */

function loadKPI() {

    /* ------------------------------
       PRODUKTE
       ------------------------------ */
    let products = JSON.parse(localStorage.getItem("gor_products") || "[]");
    document.getElementById("kpi-products").textContent = products.length;


    /* ------------------------------
       BENUTZER
       ------------------------------ */
    let users = JSON.parse(localStorage.getItem("gor_users") || "[]");

    // Falls keine Benutzer gespeichert sind → Default Users aus auth.js
    if (users.length === 0) {
        users = [
            { username: "admin", password: "admin", role: "admin" },
            { username: "mitarbeiter", password: "1234", role: "staff" }
        ];
    }

    document.getElementById("kpi-users").textContent = users.length;


    /* ------------------------------
       AUDIT LOG
       ------------------------------ */
    let audit = JSON.parse(localStorage.getItem("gor_audit") || "[]");
    document.getElementById("kpi-audit").textContent = audit.length;
}
