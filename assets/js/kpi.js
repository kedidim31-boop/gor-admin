/* =========================================================
   GOR PRODUCT ADMIN – KPI SCRIPT (ANIMATED)
   Lädt Produkt-, Benutzer- und Audit-Statistiken
   ========================================================= */

/* ---------------------------------------------------------
   ANIMATION: Zählt smooth von 0 → Zielwert
   --------------------------------------------------------- */
function animateKPI(elementId, targetValue, duration = 900) {
    const element = document.getElementById(elementId);

    if (!element) return;

    let start = 0;
    const stepTime = Math.max(20, duration / (targetValue || 1));

    const counter = setInterval(() => {
        start++;
        element.textContent = start;

        if (start >= targetValue) {
            clearInterval(counter);

            // Optional: kleiner Neon-Pulse am Ende
            element.style.textShadow = "0 0 14px rgba(255, 211, 0, 0.55)";
            setTimeout(() => {
                element.style.textShadow = "";
            }, 300);
        }
    }, stepTime);
}

/* ---------------------------------------------------------
   KPI LADEN
   --------------------------------------------------------- */
function loadKPI() {

    /* ------------------------------
       PRODUKTE
       ------------------------------ */
    let products = JSON.parse(localStorage.getItem("gor_products") || "[]");
    animateKPI("kpi-products", products.length);


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

    animateKPI("kpi-users", users.length);


    /* ------------------------------
       AUDIT LOG
       ------------------------------ */
    let audit = JSON.parse(localStorage.getItem("gor_audit") || "[]");
    animateKPI("kpi-audit", audit.length);
}
