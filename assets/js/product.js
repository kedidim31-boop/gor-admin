/* =========================================================
   GOR PRODUCT ADMIN – PRODUCT EDITOR LOGIC
   ========================================================= */

let quill;
let currentImages = [];
let editingIndex = null;

/* ---------------------------------------------------------
   INIT EDITOR + DROPZONE + LIVE PREVIEW
   --------------------------------------------------------- */
function initEditor() {
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

    setupDropzone();

    // Live update for all inputs
    document.querySelectorAll(
        "#product-name, #product-price, #product-ean, #product-sku, #product-stock, #product-vendor, #product-type"
    ).forEach(el => el.addEventListener("input", updatePreview));

    // SKU auto generator
    document.getElementById("product-name").addEventListener("input", generateSKU);
}

/* ---------------------------------------------------------
   SKU AUTO GENERATOR
   --------------------------------------------------------- */
function generateSKU() {
    const name = document.getElementById("product-name").value.trim();
    const clean = name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    document.getElementById("product-sku").value = "GOR-" + clean.substring(0, 8);
    updatePreview();
}

/* ---------------------------------------------------------
   DROPZONE
   --------------------------------------------------------- */
function setupDropzone() {
    const dropzone = document.getElementById("image-dropzone");

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
        handleImageFiles([...e.dataTransfer.files]);
    });

    dropzone.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;

        input.onchange = () => handleImageFiles([...input.files]);
        input.click();
    });
}

function handleImageFiles(files) {
    files.forEach(file => {
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
   IMAGE PREVIEW
   --------------------------------------------------------- */
function renderImagePreview() {
    const preview = document.getElementById("image-preview");
    preview.innerHTML = "";

    currentImages.forEach((src, index) => {
        const div = document.createElement("div");
        div.className = "image-thumb";

        div.innerHTML = `
            <img src="${src}">
            <button onclick="removeImage(${index})">✖</button>
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
   LOAD PRODUCT LIST
   --------------------------------------------------------- */
function loadProductList() {
    const list = getProducts();
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    list.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "product-row";
        row.onclick = () => loadProduct(i);

        row.innerHTML = `
            <strong>${p.name}</strong><br>
            <span style="opacity:0.7">${p.sku}</span>
        `;

        container.appendChild(row);
    });
}

/* ---------------------------------------------------------
   LOAD PRODUCT INTO FORM
   --------------------------------------------------------- */
function loadProduct(index) {
    const p = getProducts()[index];
    editingIndex = index;

    document.getElementById("product-name").value = p.name;
    document.getElementById("product-price").value = p.price;
    document.getElementById("product-ean").value = p.ean;
    document.getElementById("product-sku").value = p.sku;
    document.getElementById("product-stock").value = p.stock;
    document.getElementById("product-vendor").value = p.vendor;
    document.getElementById("product-type").value = p.type;

    quill.root.innerHTML = p.description;

    currentImages = [...p.images];
    renderImagePreview();

    updatePreview();
}

/* ---------------------------------------------------------
   SAVE PRODUCT
   --------------------------------------------------------- */
function saveProduct() {
    const product = {
        name: document.getElementById("product-name").value.trim(),
        price: parseFloat(document.getElementById("product-price").value),
        ean: document.getElementById("product-ean").value.trim(),
        sku: document.getElementById("product-sku").value.trim(),
        stock: parseInt(document.getElementById("product-stock").value),
        vendor: document.getElementById("product-vendor").value.trim(),
        type: document.getElementById("product-type").value.trim(),
        description: quill.root.innerHTML,
        images: [...currentImages]
    };

    if (editingIndex === null) {
        addProduct(product);
    } else {
        updateProduct(editingIndex, product);
    }

    clearProductForm();
    loadProductList();
    updatePreview();
}

/* ---------------------------------------------------------
   CLEAR FORM
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

    quill.root.innerHTML = "";

    currentImages = [];
    renderImagePreview();
    updatePreview();
}

/* ---------------------------------------------------------
   LIVE PRODUCT PREVIEW
   --------------------------------------------------------- */
function updatePreview() {
    document.getElementById("preview-title").innerText =
        document.getElementById("product-name").value || "Produktname";

    const price = document.getElementById("product-price").value;
    document.getElementById("preview-price").innerText =
        price ? `CHF ${parseFloat(price).toFixed(2)}` : "CHF 0.00";

    document.getElementById("preview-vendor").innerText =
        document.getElementById("product-vendor").value || "Vendor";

    document.getElementById("preview-type").innerText =
        document.getElementById("product-type").value || "Typ";

    document.getElementById("preview-sku").innerText =
        document.getElementById("product-sku").value || "–";

    document.getElementById("preview-stock").innerText =
        document.getElementById("product-stock").value || "0";

    document.getElementById("preview-description").innerHTML =
        quill.root.innerHTML || "Beschreibung erscheint hier…";

    renderPreviewImages();
}

function renderPreviewImages() {
    const slider = document.getElementById("preview-image-slider");
    slider.innerHTML = "";

    if (currentImages.length === 0) {
        slider.innerHTML = `<img src="assets/img/no-image.png">`;
        return;
    }

    currentImages.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        slider.appendChild(img);
    });
}
