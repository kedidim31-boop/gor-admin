/* =========================================================
   GOR PRODUCT ADMIN – NOTIFICATION SYSTEM
   Systemmeldungen, Updates, Warnungen
   ========================================================= */

/* ---------------------------------------------------------
   NOTIFICATION ANZEIGEN
   --------------------------------------------------------- */
function showNotification(message, type = "info", duration = 5000) {
    const containerId = "notification-container";
    let container = document.getElementById(containerId);

    // Container erstellen, falls nicht vorhanden
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.className = "notification-container";
        document.body.appendChild(container);
    }

    // Notification-Element erstellen
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Close-Button
    notification.querySelector(".notification-close").addEventListener("click", () => {
        removeNotification(notification);
        logAudit("notification_close", `Benachrichtigung geschlossen: ${message}`);
    });

    // Animiertes Einblenden
    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    container.appendChild(notification);

    // Automatisches Entfernen nach Ablauf
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }

    // Optional: Audit-Eintrag
    if (typeof logAudit === "function") {
        logAudit("notification_show", `Benachrichtigung angezeigt: ${type.toUpperCase()} – ${message}`);
    }
}

/* ---------------------------------------------------------
   NOTIFICATION ENTFERNEN
   --------------------------------------------------------- */
function removeNotification(notification) {
    if (!notification) return;

    notification.classList.remove("show");
    notification.classList.add("hide");

    setTimeout(() => {
        notification.remove();
        const container = document.getElementById("notification-container");
        if (container && container.children.length === 0) {
            container.remove();
        }
    }, 400);
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // Beispiel: Systemmeldung beim Start
    showNotification("Dashboard geladen", "info", 3000);
});
