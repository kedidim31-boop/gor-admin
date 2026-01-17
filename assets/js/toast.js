/* =========================================================
   GOR PRODUCT ADMIN – TOAST SYSTEM
   Erfolg, Fehler, Warnung, Info anzeigen (animiert)
   ========================================================= */

function showToast(message, type = "info", duration = 3000) {
    const containerId = "toast-container";
    let container = document.getElementById(containerId);

    // Container erstellen, falls nicht vorhanden
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Toast-Element erstellen
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    // Animiertes Einblenden
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    container.appendChild(toast);

    // Automatisches Entfernen nach Ablauf
    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");

        // Nach Animation entfernen
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 400);
    }, duration);

    // Optional: Audit-Eintrag für wichtige Meldungen
    if (typeof logAudit === "function" && (type === "error" || type === "success")) {
        logAudit("toast", `Toast angezeigt: ${type.toUpperCase()} – ${message}`);
    }
}
