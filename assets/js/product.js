/* =========================================================
   GOR PRODUCT ADMIN – PRODUKTVERWALTUNG (Neues System)
   Mehrere Produkte, Liste, CSV Export, Auto-SKU
   ========================================================= */

/* ---------------------------------------------------------
   PRODUKTE LADEN & SPEICHERN
   --------------------------------------------------------- */
function getProducts() {
    return JSON.parse(localStorage.getItem("gor_products")) || [];
}

function saveProducts(list) {
    localStorage.setItem("gor_products", JSON.stringify(list));
}

/* ---------------------------------------------------------
   PRODUKT HINZUFÜGEN
   --------------------------------------------------------- */
function addProduct() {
    const product = {
        name: document.getElementById("product-name").value.trim(),
        price: document.getElementById("product-price").value.trim(),
        ean: document.getElementById("product-ean").value.trim(),
        collections: document.getElementById("product-collections").value.trim(),
        sku: document.getElementById("product-sku").value.trim(),
        stock: document.getElementById("product-stock").value.trim(),
        vendor: document.getElementById("product-vendor").value.trim(),
        type: document.getElementById("product-type").value.trim(),
        description: document.getElementById("product-description").value.trim(),
        images: window.currentImages || []
    };

    if (!product.name) {
        showToast("Produktname fehlt", "error");
        return;
    }

    const list = getProducts();
    list.push(product);
    saveProducts(list);

    // SKU Seed erhöhen
    incrementSKUSeed();

    showToast("Produkt hinzugefügt", "success");

    clearProductForm();
    renderProductList();
}

/* ---------------------------------------------------------
   FORMULAR LEEREN
   --------------------------------------------------------- */
function clearProductForm() {
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-ean").value = "";
    document.getElementById("product-collections").value = "";
    document.getElementById("product-sku").value = "";
    document.getElementById("product-stock").value = "";
    document.getElementById("product-vendor").value = "";
    document.getElementById("product-type").value = "";
    document.getElementById("product-description").value = "";

    window.currentImages = [];
    const preview = document.getElementById("image-preview");
    if (preview) preview.innerHTML = "";
}

/* ---------------------------------------------------------
   PRODUKTLISTE RENDERN
   --------------------------------------------------------- */
function renderProductList() {
    const list = getProducts();
    const container = document.getElementById("product-list");

    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = "<p>Keine Produkte vorhanden.</p>";
        return;
    }

    container.innerHTML = "";

    list.forEach((p, index) => {
        container.innerHTML += `
            <div class="flex-between mb-10 product-row">
                <div>
                    <strong>${p.name}</strong><br>
                    <small>
                        SKU: ${p.sku || "-"} |
                        Bestand: ${p.stock || 0} |
                        Typ: ${p.type || "-"} |
                        Anbieter: ${p.vendor || "-"}
                    </small>
                </div>

                <button class="danger" onclick="deleteProduct(${index})">Löschen</button>
            </div>
        `;
    });
}

/* ---------------------------------------------------------
   PRODUKT LÖSCHEN
   --------------------------------------------------------- */
function deleteProduct(index) {
    const list = getProducts();
    list.splice(index, 1);
    saveProducts(list);

    renderProductList();
    showToast("Produkt gelöscht", "success");
}

/* ---------------------------------------------------------
   CSV EXPORT
   --------------------------------------------------------- */
function downloadCSV() {
    const list = getProducts();

    if (list.length === 0) {
        showToast("Keine Produkte vorhanden", "error");
        return;
    }

    const header = [
        "Name",
        "Preis",
        "EAN",
        "Kollektionen",
        "SKU",
        "Bestand",
        "Anbieter",
        "Typ",
        "Beschreibung"
    ];

    const rows = list.map(p => [
        p.name,
        p.price,
        p.ean,
        p.collections,
        p.sku,
        p.stock,
        p.vendor,
        p.type,
        (p.description || "").replace(/\n/g, " ")
    ]);

    let csv = header.join(",") + "\n";
    rows.forEach(r => csv += r.join(",") + "\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "produkte.csv";
    a.click();

    URL.revokeObjectURL(url);

    showToast("CSV exportiert", "success");
}