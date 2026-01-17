/* =========================================================
   GOR PRODUCT ADMIN – CSV SYSTEM
   Import, Export, Fehleranalyse, Shopify-Kompatibilität
   ========================================================= */

/* ---------------------------------------------------------
   SHOPIFY CSV HEADER
   --------------------------------------------------------- */
const SHOPIFY_HEADER = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Type",
    "Tags",
    "Published",
    "Option1 Name",
    "Option1 Value",
    "Variant SKU",
    "Variant Price",
    "Variant Inventory Qty",
    "Image Src",
    "Variant Barcode"
];

/* ---------------------------------------------------------
   EXPORT PRODUCTS TO CSV
   --------------------------------------------------------- */
function exportProductsToCSV() {
    const products = getProducts();

    if (products.length === 0) {
        alert("Keine Produkte vorhanden.");
        return;
    }

    const rows = products.map(p => ({
        "Handle": p.title.toLowerCase().replace(/\s+/g, "-"),
        "Title": p.title,
        "Body (HTML)": p.description,
        "Vendor": p.vendor,
        "Type": p.type,
        "Tags": p.tags.join(", "),
        "Published": p.status === "Aktiv" ? "TRUE" : "FALSE",
        "Option1 Name": "Title",
        "Option1 Value": p.title,
        "Variant SKU": p.sku,
        "Variant Price": p.price,
        "Variant Inventory Qty": p.stock,
        "Image Src": p.images[0] || "",
        "Variant Barcode": p.ean
    }));

    const csv = buildCSV([SHOPIFY_HEADER, ...rows.map(r => Object.values(r))]);

    downloadFile("products-shopify.csv", csv);

    addAuditEntry("CSV Export", "Produktliste exportiert.");
}

/* ---------------------------------------------------------
   IMPORT CSV
   --------------------------------------------------------- */
function importCSV(file) {
    const reader = new FileReader();

    reader.onload = e => {
        const text = e.target.result;
        const rows = parseCSV(text);

        if (!rows || rows.length === 0) {
            alert("CSV ist leer oder ungültig.");
            return;
        }

        const imported = [];

        rows.forEach(row => {
            const product = {
                id: generateId(),
                title: row["Title"] || row["title"] || "Unbenannt",
                description: row["Body (HTML)"] || "",
                vendor: row["Vendor"] || "",
                type: row["Type"] || "",
                collections: [],
                tags: row["Tags"] ? row["Tags"].split(",").map(t => t.trim()) : [],
                price: formatPrice(row["Variant Price"] || "0"),
                sku: row["Variant SKU"] || "",
                ean: row["Variant Barcode"] || "",
                stock: parseInt(row["Variant Inventory Qty"] || 0),
                status: row["Published"] === "TRUE" ? "Aktiv" : "Inaktiv",
                images: row["Image Src"] ? [row["Image Src"]] : []
            };

            imported.push(product);
        });

        // Speichern
        const existing = getProducts();
        saveProducts([...existing, ...imported]);

        addAuditEntry("CSV Import", `${imported.length} Produkte importiert.`);

        alert(`${imported.length} Produkte erfolgreich importiert.`);
        renderProductTable();
    };

    reader.readAsText(file);
}

/* ---------------------------------------------------------
   VALIDATE CSV STRUCTURE
   --------------------------------------------------------- */
function validateCSVStructure(headerRow) {
    return SHOPIFY_HEADER.every(h => headerRow.includes(h));
}
