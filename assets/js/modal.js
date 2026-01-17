/* =========================================================
   GOR PRODUCT ADMIN – MODAL SYSTEM
   Öffnen, Schließen, Inhalt setzen, Bestätigungen
   ========================================================= */

/* ---------------------------------------------------------
   MODAL ANZEIGEN
   --------------------------------------------------------- */
function showModal(title, contentHTML, actionsHTML = "") {
    closeModal(); // Falls ein Modal offen ist → schließen

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "active-modal";

    backdrop.innerHTML = `
        <div class="modal">
            <h2>${title}</h2>
            <div class="modal-content">${contentHTML}</div>
            <div class="modal-actions">${actionsHTML}</div>
        </div>
    `;

    // Schließen bei Klick auf Backdrop
    backdrop.addEventListener("click", e => {
        if (e.target === backdrop) closeModal();
    });

    document.body.appendChild(backdrop);

    // ESC schließt Modal
    document.addEventListener("keydown", escHandler);
}

/* ---------------------------------------------------------
   MODAL SCHLIESSEN
   --------------------------------------------------------- */
function closeModal() {
    const modal = document.getElementById("active-modal");
    if (modal) modal.remove();
    document.removeEventListener("keydown", escHandler);
}

/* ESC KEY HANDLER */
function escHandler(e) {
    if (e.key === "Escape") {
        closeModal();
    }
}

/* ---------------------------------------------------------
   CONFIRM MODAL
   --------------------------------------------------------- */
function confirmModal(message, onConfirm) {
    showModal(
        "Bestätigen",
        `<p>${message}</p>`,
        `
            <button class="danger" id="confirm-yes">Ja</button>
            <button id="confirm-no">Abbrechen</button>
        `
    );

    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            closeModal();
            if (typeof onConfirm === "function") {
                onConfirm();
                logAudit("modal_confirm", `Aktion bestätigt: ${message}`);
            }
        });
    }

    if (noBtn) {
        noBtn.addEventListener("click", () => {
            closeModal();
            logAudit("modal_cancel", `Aktion abgebrochen: ${message}`);
        });
    }
}
