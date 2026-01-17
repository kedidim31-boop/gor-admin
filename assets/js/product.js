/* =========================================================
   GOR PRODUCT ADMIN – PRODUCT EDITOR (FINAL, SHOPIFY-STYLE)
   ========================================================= */

let quill;
let currentImages = [];
let editingIndex = null;

/* ---------------------------------------------------------
   INIT – Editor, Dropzone, Inputs, Preview
   --------------------------------------------------------- */
function initEditor() {
    // Quill Editor
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Produktbeschreibung eingeben...',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    quill.on('text-change', updatePreview);

    // Dropzone
    setupDropzone();

    // Inputs → Live Preview
    const fields = [
        "#product-name",
        "#product-price",
        "#product-ean",
        "#product-sku",
        "#product-stock",
        "#product-vendor",
        "#product-type"
    ];

    fields.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.addEventListener("input", updatePreview);
    });

    // SKU Auto-Generator
    const nameInput = document.getElementById("product-name");
    if (nameInput) {
        nameInput.addEventListener("input", generateSKU);
    }

    // Initial Preview
    updatePreview();
    loadProductList();
}

/* ---------------------------------------------------------
   SKU AUTO GENERATOR
   --------------------------------------------------------- */
function generateSKU() {
    const name = document.getElementById("product-name")?.value.trim() || "";
    if (!name) {
        document.getElementById("product-sku").value = "";
        updatePreview();
        return;
    }

    const clean = name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const base = clean.substring(0, 8);
    document.getElementById("product-sku").value = "GOR-" + base;
    updatePreview();
}

/* ---------------------------------------------------------
   DROPZONE – DRAG & DROP + CLICK
   --------------------------------------------------------- */
function setupDropzone() {
    const dropzone = document.getElementById("image-dropzone");
    if (!dropzone) return;

    dropzone.addEventListener("dragover", e => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", e => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
        handleImageFiles([...e.dataTransfer.files]);
    });

    dropzone.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;

        input.onchange = () => {
            if (!input.files || input.files.length === 0) return;
            handleImageFiles([...input.files]);
        };

        input.click();
    });
}

function handleImageFiles(files) {
    files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = () => {
            currentImages.push(reader.result);
            renderImagePreview();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
}

/* ---------------------------------------------------------
   IMAGE PREVIEW (THUMBS)
   --------------------------------------------------------- */
function renderImagePreview() {
    const preview = document.getElementById("image-preview");
    if (!preview) return;

    preview.innerHTML = "";

    if (currentImages.length === 0) {
        preview.innerHTML = `<div style="opacity:0.6;">Keine Bilder hinzugefügt</div>`;
        return;
    }

    currentImages.forEach((src, index) => {
        const div = document.createElement("div");
        div.className = "image-thumb";

        div.innerHTML = `
            <img src="${src}" alt="Produktbild ${index + 1}">
            <button type="button" onclick="removeImage(${index})">✖</button>
        `;

        preview.appendChild(div);
    });
}

function removeImage(index) {
    currentImages.splice(index, 1);
    renderImagePreview();
    updatePreview();
}

/* ---------------------------------------------------------
   PRODUKTLISTE LADEN
   --------------------------------------------------------- */
function loadProductList() {
    const list = getProducts ? getProducts() : [];
    const container = document.getElementById("product-list");
    if (!container) return;

    container.innerHTML = "";

    if (!list || list.length === 0) {
        container.innerHTML = `<div style="opacity:0.6;">Noch keine Produkte vorhanden</div>`;
        return;
    }

    list.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "product-row";
        row.onclick = () => loadProduct(i);

        row.innerHTML = `
            <strong>${p.name || "Unbenanntes Produkt"}</strong><br>
            <span style="opacity:0.7">${p.sku || "Keine SKU"}</span>
        `;

        container.appendChild(row);
    });
}

/* ---------------------------------------------------------
   PRODUKT IN FORM LADEN
   --------------------------------------------------------- */
function loadProduct(index) {
    const list = getProducts ? getProducts() : [];
    const p = list[index];
    if (!p) return;

    editingIndex = index;

    document.getElementById("product-name").value = p.name || "";
    document.getElementById("product-price").value = p.price ?? "";
    document.getElementById("product-ean").value = p.ean || "";
    document.getElementById("product-sku").value = p.sku || "";
    document.getElementById("product-stock").value = p.stock ?? "";
    document.getElementById("product-vendor").value = p.vendor || "";
    document.getElementById("product-type").value = p.type || "";

    if (quill) {
        quill.root.innerHTML = p.description || "";
    }

    currentImages = Array.isArray(p.images) ? [...p.images] : [];
    renderImagePreview();
    updatePreview();
}

/* ---------------------------------------------------------
   PRODUKT SPEICHERN (NEU / UPDATE)
   --------------------------------------------------------- */
function saveProduct() {
    const name = document.getElementById("product-name").value.trim();
    const priceRaw = document.getElementById("product-price").value;
    const stockRaw = document.getElementById("product-stock").value;

    const product = {
        name,
        price: priceRaw ? parseFloat(priceRaw) : 0,
        ean: document.getElementById("product-ean").value.trim(),
        sku: document.getElementById("product-sku").value.trim(),
        stock: stockRaw ? parseInt(stockRaw) : 0,
        vendor: document.getElementById("product-vendor").value.trim(),
        type: document.getElementById("product-type").value.trim(),
        description: quill ? quill.root.innerHTML : "",
        images: [...currentImages]
    };

    if (!name) {
        alert("Bitte einen Produktnamen eingeben.");
        return;
    }

    if (typeof addProduct === "function" && typeof updateProduct === "function") {
        if (editingIndex === null) {
            addProduct(product);
        } else {
            updateProduct(editingIndex, product);
        }
    }

    clearProductForm();
    loadProductList();
    updatePreview();
}

/* ---------------------------------------------------------
   FORMULAR LEEREN
   --------------------------------------------------------- */
function clearProductForm() {
    editingIndex = null;

    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-ean").value = "";
    document.getElementById("product-sku").value = "";
    document.getElementById("product-stock").value = "";
    document.getElementById("product-vendor").value = "";
    document.getElementById("product-type").value = "";

    if (quill) {
        quill.root.innerHTML = "";
    }

    currentImages = [];
    renderImagePreview();
    updatePreview();
}

/* ---------------------------------------------------------
   LIVE PRODUKTVORSCHAU (SHOPIFY-STYLE)
   --------------------------------------------------------- */
function updatePreview() {
    // Titel
    const name = document.getElementById("product-name")?.value || "";
    document.getElementById("preview-title").innerText = name || "Produktname";

    // Preis
    const priceRaw = document.getElementById("product-price")?.value || "";
    const price = priceRaw ? parseFloat(priceRaw) : 0;
    document.getElementById("preview-price").innerText =
        price ? `CHF ${price.toFixed(2)}` : "CHF 0.00";

    // Vendor & Typ
    const vendor = document.getElementById("product-vendor")?.value || "";
    const type = document.getElementById("product-type")?.value || "";

    document.getElementById("preview-vendor").innerText = vendor || "Vendor";
    document.getElementById("preview-type").innerText = type || "Typ";

    // SKU & Stock
    const sku = document.getElementById("product-sku")?.value || "";
    const stock = document.getElementById("product-stock")?.value || "";

    document.getElementById("preview-sku").innerText = sku || "–";
    document.getElementById("preview-stock").innerText = stock || "0";

    // Beschreibung
    const descHTML = quill ? quill.root.innerHTML.trim() : "";
    document.getElementById("preview-description").innerHTML =
        descHTML || "Beschreibung erscheint hier…";

    // Bilder
    renderPreviewImages();
}

function renderPreviewImages() {
    const slider = document.getElementById("preview-image-slider");
    if (!slider) return;

    slider.innerHTML = "";

    if (!currentImages || currentImages.length === 0) {
        slider.innerHTML = `<img src="assets/img/no-image.png" alt="Kein Bild verfügbar">`;
        return;
    }

    currentImages.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Produktbild ${index + 1}`;
        slider.appendChild(img);
    });
}
