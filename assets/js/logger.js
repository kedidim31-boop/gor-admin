/* =========================================================
   GOR PRODUCT ADMIN – LOGGER SYSTEM
   Zentrales Logging für Audit, Fehler, Warnungen, Debug
   ========================================================= */

const LOGGER = {
    level: "debug", // debug | info | warn | error
    levels: ["debug", "info", "warn", "error"]
};

/* ---------------------------------------------------------
   GENERIC LOGGER
   --------------------------------------------------------- */
function logMessage(level, type, message) {
    if (!LOGGER.levels.includes(level)) level = "info";

    const entry = {
        timestamp: new Date().toISOString(),
        user: GOR_STATE?.user?.username || "System",
        level,
        type,
        message
    };

    // In Konsole ausgeben
    console.log(`[${level.toUpperCase()}] ${type}: ${message}`);

    // In Audit speichern
    let audit = JSON.parse(localStorage.getItem("gor_audit") || "[]");
    audit.push(entry);
    localStorage.setItem("gor_audit", JSON.stringify(audit));
}

/* ---------------------------------------------------------
   SHORTCUTS
   --------------------------------------------------------- */
function logInfo(type, message) {
    logMessage("info", type, message);
}

function logError(type, message) {
    logMessage("error", type, message);
}

function logWarn(type, message) {
    logMessage("warn", type, message);
}

function logDebug(type, message) {
    if (LOGGER.level === "debug") {
        logMessage("debug", type, message);
    }
}

/* ---------------------------------------------------------
   AUDIT WRAPPER
   --------------------------------------------------------- */
function logAudit(type, details) {
    logInfo(type, details);
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    logInfo("system_start", "Logger initialisiert und bereit.");
});
