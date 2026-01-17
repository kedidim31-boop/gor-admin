/* =========================================================
   GOR – STATE MANAGER
   Globale Verwaltung von Session, Settings, Produkten & Audit
   ========================================================= */

const GOR_STATE = {
    user: null,
    settings: {
        shopName: "Gaming of Republic",
        supportEmail: "support@gamingofrepublic.com",
        currency: "CHF",
        language: "de"
    },
    products: [],
    audit: []
};

/* ---------------------------------------------------------
   SESSION MANAGEMENT
   --------------------------------------------------------- */
function login(username, role = "admin") {
    GOR_STATE.user = { username, role };
    localStorage.setItem("gor_user", JSON.stringify(GOR_STATE.user));
    logAudit("login_success", `User ${username} hat sich erfolgreich eingeloggt.`);
    window.location.href = "dashboard.html";
}

function logout() {
    logAudit("logout", `User ${GOR_STATE.user?.username || "?"} hat sich ausgeloggt.`);
    GOR_STATE.user = null;
    localStorage.removeItem("gor_user");
    window.location.href = "index.html";
}

function requireRole(role) {
    const user = GOR_STATE.user || JSON.parse(localStorage.getItem("gor_user"));
    if (!user || user.role !== role) {
        alert("Du hast keine Berechtigung für diesen Bereich.");
        window.location.href = "index.html";
    }
}

/* ---------------------------------------------------------
   SETTINGS MANAGEMENT
   --------------------------------------------------------- */
function loadSettings() {
    const saved = localStorage.getItem("gor_settings");
    if (saved) {
        GOR_STATE.settings = JSON.parse(saved);
    }
    document.getElementById("setting-shop-name").value = GOR_STATE.settings.shopName;
    document.getElementById("setting-support-email").value = GOR_STATE.settings.supportEmail;
    document.getElementById("setting-currency").value = GOR_STATE.settings.currency;
    document.getElementById("setting-language").value = GOR_STATE.settings.language;
}

function saveSettings() {
    GOR_STATE.settings.shopName = document.getElementById("setting-shop-name").value;
    GOR_STATE.settings.supportEmail = document.getElementById("setting-support-email").value;
    GOR_STATE.settings.currency = document.getElementById("setting-currency").value;
    GOR_STATE.settings.language = document.getElementById("setting-language").value;

    localStorage.setItem("gor_settings", JSON.stringify(GOR_STATE.settings));
    logAudit("settings_save", "Systemeinstellungen gespeichert.");
    alert("Einstellungen erfolgreich gespeichert!");
}

/* ---------------------------------------------------------
   PRODUCT MANAGEMENT
   --------------------------------------------------------- */
function addProduct(product) {
    GOR_STATE.products.push(product);
    localStorage.setItem("gor_products", JSON.stringify(GOR_STATE.products));
    logAudit("product_save", `Produkt gespeichert: ${product.name}`);
}

function loadProductsFromStorage() {
    const saved = localStorage.getItem("gor_products");
    if (saved) {
        GOR_STATE.products = JSON.parse(saved);
    }
}

/* ---------------------------------------------------------
   AUDIT LOG
   --------------------------------------------------------- */
function logAudit(type, details) {
    const entry = {
        timestamp: new Date().toISOString(),
        user: GOR_STATE.user?.username || "System",
        type,
        details
    };
    GOR_STATE.audit.push(entry);
    localStorage.setItem("gor_audit", JSON.stringify(GOR_STATE.audit));
    console.log(`[AUDIT] ${type}: ${details}`);
}

function loadAuditLog() {
    const saved = localStorage.getItem("gor_audit");
    if (saved) {
        GOR_STATE.audit = JSON.parse(saved);
    }
    const table = document.getElementById("audit-table");
    if (!table) return;

    table.innerHTML = "";
    GOR_STATE.audit.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(entry.timestamp).toLocaleString()}</td>
            <td>${entry.user}</td>
            <td>${entry.type}</td>
            <td>${entry.details}</td>
        `;
        table.appendChild(row);
    });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // Lade gespeicherte Daten
    loadProductsFromStorage();
    loadSettings();

    // Lade User aus Storage
    const savedUser = localStorage.getItem("gor_user");
    if (savedUser) {
        GOR_STATE.user = JSON.parse(savedUser);
    }
});
