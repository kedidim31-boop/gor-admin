/* =========================================================
   GOR PRODUCT ADMIN – MODAL SYSTEM
   Öffnen, Schließen, Inhalt setzen
   ========================================================= */

function showModal(title, contentHTML, actionsHTML = "") {
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

    document.body.appendChild(backdrop);
}

function closeModal() {
    const modal = document.getElementById("active-modal");
    if (modal) modal.remove();
}

function confirmModal(message, onConfirm) {
    showModal("Bestätigen", `<p>${message}</p>`, `
        <button class="danger" onclick="closeModal(); ${onConfirm.name}();">Ja</button>
        <button onclick="closeModal()">Abbrechen</button>
    `);
}
