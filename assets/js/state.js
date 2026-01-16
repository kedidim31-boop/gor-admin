/* =========================================================
   GOR PRODUCT ADMIN – STATE MANAGEMENT (NEUE VERSION)
   Produkte, Benutzer, Audit-Log, Utility-Funktionen
   ========================================================= */


/* =========================================================
   PRODUKTE
   ========================================================= */

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem("gor_products") || "[]");
    } catch (e) {
        return [];
    }
}

function saveProducts(products) {
    if (!Array.isArray(products)) return;
    localStorage.setItem("gor_products", JSON.stringify(products));
}

/**
 * Produkt nach ID finden
 */
function getProductById(id) {
    const products = getProducts();
    return products.find(p => String(p.id) === String(id));
}

/**
 * Produkt speichern (neu oder update)
 */
function upsertProduct(product) {
    const products = getProducts();

    if (!product.id) {
        // Neue ID vergeben (einfacher Auto-Increment)
        const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
        product.id = maxId + 1;
        products.push(product);
    } else {
        const index = products.findIndex(p => String(p.id) === String(product.id));
        if (index !== -1) {
            products[index] = product;
        } else {
            products.push(product);
        }
    }

    saveProducts(products);

    if (typeof addAuditEntry === "function") {
        addAuditEntry("product_save", `Produkt #${product.id} wurde gespeichert`);
    }
}

/**
 * Produkt löschen
 */
function deleteProduct(id) {
    let products = getProducts();
    const before = products.length;
    products = products.filter(p => String(p.id) !== String(id));
    saveProducts(products);

    if (products.length !== before && typeof addAuditEntry === "function") {
        addAuditEntry("product_delete", `Produkt #${id} wurde gelöscht`);
    }
}


/* =========================================================
   BENUTZER (ERGÄNZUNG ZU auth.js)
   ========================================================= */

function saveUsers(users) {
    if (!Array.isArray(users)) return;
    localStorage.setItem("gor_users", JSON.stringify(users));
}

function addUser(user) {
    const users = getUsers(); // aus auth.js
    users.push(user);
    saveUsers(users);

    if (typeof addAuditEntry === "function") {
        addAuditEntry("user_add", `Benutzer ${user.username} wurde angelegt`);
    }
}

function deleteUser(username) {
    let users = getUsers();
    const before = users.length;
    users = users.filter(u => u.username !== username);
    saveUsers(users);

    if (users.length !== before && typeof addAuditEntry === "function") {
        addAuditEntry("user_delete", `Benutzer ${username} wurde gelöscht`);
    }
}


/* =========================================================
   AUDIT LOG
   ========================================================= */

function getAuditLog() {
    try {
        return JSON.parse(localStorage.getItem("gor_audit") || "[]");
    } catch (e) {
        return [];
    }
}

function saveAuditLog(entries) {
    if (!Array.isArray(entries)) return;
    localStorage.setItem("gor_audit", JSON.stringify(entries));
}

/**
 * Audit-Eintrag hinzufügen
 * type: z.B. "login", "logout", "product_save", "user_add"
 * message: Beschreibung
 */
function addAuditEntry(type, message) {
    const entries = getAuditLog();
    const session = getSession && typeof getSession === "function" ? getSession() : null;

    entries.unshift({
        timestamp: new Date().toISOString(),
        type: type,
        message: message,
        user: session && session.user ? session.user : "unbekannt"
    });

    saveAuditLog(entries);
}


/* =========================================================
   GENERISCHE HILFSFUNKTIONEN
   ========================================================= */

/**
 * Formatiert ein ISO-Datum schön lesbar
 */
function formatDateTime(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Einfache UUID für interne IDs
 */
function generateId() {
    return "gor_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
