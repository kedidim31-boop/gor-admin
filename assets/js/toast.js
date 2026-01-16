/* =========================================================
   GOR PRODUCT ADMIN – TOAST SYSTEM
   Erfolg, Fehler, Info anzeigen
   ========================================================= */

function showToast(message, type = "info", duration = 3000) {
    const containerId = "toast-container";
    let container = document.getElementById(containerId);

    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) container.remove();
    }, duration);
}
