/* =========================================================
   GOR PRODUCT ADMIN – BILDVERWALTUNG (Neues System)
   Drag & Drop + Vorschau
   ========================================================= */

window.currentImages = [];

/* ---------------------------------------------------------
   BILDER HOCHLADEN
   --------------------------------------------------------- */
function handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            window.currentImages.push(e.target.result);
            renderImagePreview(window.currentImages);
        };
        reader.readAsDataURL(file);
    });
}

/* ---------------------------------------------------------
   VORSCHAU RENDERN
   --------------------------------------------------------- */
function renderImagePreview(images) {
    const container = document.getElementById("image-preview");
    if (!container) return;

    if (!images || images.length === 0) {
        container.innerHTML = "<p>Keine Bilder ausgewählt.</p>";
        return;
    }

    container.innerHTML = "";

    images.forEach((src, index) => {
        const div = document.createElement("div");
        div.className = "thumbnail-wrapper";

        div.innerHTML = `
            <img src="${src}" class="thumbnail">
            <button class="danger mt-5" onclick="removeImage(${index})">Entfernen</button>
        `;

        container.appendChild(div);
    });
}

/* ---------------------------------------------------------
   BILD ENTFERNEN
   --------------------------------------------------------- */
function removeImage(index) {
    window.currentImages.splice(index, 1);
    renderImagePreview(window.currentImages);
}
