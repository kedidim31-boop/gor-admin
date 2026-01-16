/* =========================================================
   GOR PRODUCT ADMIN – SKU GENERATOR (Neues System)
   Automatische SKU-Erzeugung basierend auf Prefix + Seed
   ========================================================= */

/* ---------------------------------------------------------
   SETTINGS LADEN / SPEICHERN (leichtes System)
   --------------------------------------------------------- */
function getSettings() {
    return JSON.parse(localStorage.getItem("gor_settings")) || {
        skuPrefix: "GOR",
        skuSeed: 1000
    };
}

function saveSettings(settings) {
    localStorage.setItem("gor_settings", JSON.stringify(settings));
}

/* ---------------------------------------------------------
   GENERATE SKU FROM SETTINGS + PRODUCT NAME
   --------------------------------------------------------- */
function generateSKUFromTitle(title) {
    const settings = getSettings();

    const prefix = settings.skuPrefix || "GOR";
    const seed = settings.skuSeed || 1000;

    // Clean title → uppercase, remove special chars
    const clean = title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 6);

    // SKU = PREFIX-CLEAN-SEED
    const sku = `${prefix}-${clean}-${seed}`;

    return sku;
}

/* ---------------------------------------------------------
   APPLY SKU TO INPUT FIELD (angepasst an neues System)
   --------------------------------------------------------- */
function autoFillSKU() {
    const title = document.getElementById("product-name").value.trim();
    if (!title) return;

    const sku = generateSKUFromTitle(title);
    document.getElementById("product-sku").value = sku;
}

/* ---------------------------------------------------------
   INCREMENT SKU SEED AFTER PRODUCT CREATION
   --------------------------------------------------------- */
function incrementSKUSeed() {
    const settings = getSettings();
    settings.skuSeed = (settings.skuSeed || 1000) + 1;
    saveSettings(settings);
}
