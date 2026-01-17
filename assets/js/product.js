/* =========================================================
   GOR – PRODUCT MODULE
   Produktverwaltung: Laden, Speichern, Vorschau, Medien
   ========================================================= */

let productList = [];
let quill;

/* INIT EDITOR */
function initEditor() {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Schreibe hier deine Produktbeschreibung...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image']
            ]
        }
    });
}

/* LOAD PRODUCT LIST */
function loadProducts() {
    const listContainer = document.getElementById('product-list');
    listContainer.innerHTML = '';

    if (productList.length === 0) {
        listContainer.innerHTML = '<p class="text-muted">Noch keine Produkte vorhanden.</p>';
        return;
    }

    productList.forEach((p, index) => {
        const row = document.createElement('div');
        row.className = 'product-row';
        row.innerHTML = `
            <strong>${p.name}</strong> – CHF ${p.price.toFixed(2)}
            <br><span class="text-muted">SKU: ${p.sku} | Bestand: ${p.stock}</span>
        `;
        row.onclick = () => editProduct(index);
        listContainer.appendChild(row);
    });
}

/* CLEAR FORM */
function clearProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-ean').value = '';
    document.getElementById('product-sku').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-vendor').value = '';
    document.getElementById('product-type').value = '';
    quill.setText('');
    document.getElementById('image-preview').innerHTML = '';
    updatePreview();
}

/* SAVE PRODUCT */
function saveProduct() {
    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value) || 0,
        ean: document.getElementById('product-ean').value,
        sku: document.getElementById('product-sku').value,
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        vendor: document.getElementById('product-vendor').value,
        type: document.getElementById('product-type').value,
        description: quill.root.innerHTML,
        images: collectImages()
    };

    productList.push(product);
    loadProducts();
    updatePreview(product);

    logAudit('product_save', `Produkt gespeichert: ${product.name}`);
    clearProductForm();
}

/* EDIT PRODUCT */
function editProduct(index) {
    const p = productList[index];
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-ean').value = p.ean;
    document.getElementById('product-sku').value = p.sku;
    document.getElementById('product-stock').value = p.stock;
    document.getElementById('product-vendor').value = p.vendor;
    document.getElementById('product-type').value = p.type;
    quill.root.innerHTML = p.description;
    renderImagePreview(p.images);
    updatePreview(p);
}

/* IMAGE UPLOAD & PREVIEW */
function initImageDropzone() {
    const dropzone = document.getElementById('image-dropzone');
    dropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = e => handleImageUpload(e.target.files);
        input.click();
    });
}

function handleImageUpload(files) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const thumb = document.createElement('div');
            thumb.className = 'image-thumb';
            thumb.innerHTML = `
                <img src="${e.target.result}">
                <button onclick="removeImage(this)">✕</button>
            `;
            preview.appendChild(thumb);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(btn) {
    btn.parentElement.remove();
}

function collectImages() {
    const thumbs = document.querySelectorAll('.image-thumb img');
    return Array.from(thumbs).map(img => img.src);
}

function renderImagePreview(images) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    images.forEach(src => {
        const thumb = document.createElement('div');
        thumb.className = 'image-thumb';
        thumb.innerHTML = `<img src="${src}">`;
        preview.appendChild(thumb);
    });
}

/* LIVE PREVIEW */
function updatePreview(product = null) {
    document.getElementById('preview-title').innerText = product?.name || 'Produktname';
    document.getElementById('preview-price').innerText = product ? `CHF ${product.price.toFixed(2)}` : 'CHF 0.00';
    document.getElementById('preview-vendor').innerText = product?.vendor || 'Hersteller';
    document.getElementById('preview-type').innerText = product?.type || 'Kategorie';
    document.getElementById('preview-sku').innerText = product?.sku || '–';
    document.getElementById('preview-stock').innerText = product?.stock || '0';
    document.getElementById('preview-description').innerHTML = product?.description || 'Die Beschreibung erscheint hier.';
    
    const slider = document.getElementById('preview-image-slider');
    slider.innerHTML = '';
    (product?.images || []).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        slider.appendChild(img);
    });
}

/* AUDIT LOG */
function logAudit(type, details) {
    console.log(`[AUDIT] ${type}: ${details}`);
    // Hier kannst du später eine echte Speicherung ins Backend einbauen
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    initImageDropzone();
    loadProducts();
});
