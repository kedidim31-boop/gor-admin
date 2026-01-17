/* =========================================================
   GOR PRODUCT ADMIN – UTILS
   Hilfsfunktionen für das gesamte System
   ========================================================= */

/* ---------------------------------------------------------
   GENERATE UNIQUE ID
   --------------------------------------------------------- */
function generateId() {
    return "gor_" + Math.random().toString(36).substr(2, 9);
}

/* ---------------------------------------------------------
   DEEP CLONE
   --------------------------------------------------------- */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/* ---------------------------------------------------------
   GET URL PARAMETER
   --------------------------------------------------------- */
function getUrlParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

/* ---------------------------------------------------------
   FORMAT PRICE
   --------------------------------------------------------- */
function formatPrice(value) {
    if (!value) return "0.00";
    let num = parseFloat(value.toString().replace(",", "."));
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
}

/* ---------------------------------------------------------
   VALIDATE EAN (13 digits)
   --------------------------------------------------------- */
function isValidEAN(ean) {
    return /^[0-9]{13}$/.test(ean);
}

/* ---------------------------------------------------------
   CSV PARSER
   --------------------------------------------------------- */
function parseCSV(text) {
    const rows = text.split("\n").map(r => r.trim());
    const header = rows[0].split(",");

    const data = rows.slice(1).map(row => {
        const cols = row.split(",");
        let obj = {};
        header.forEach((h, i) => {
            obj[h.trim()] = cols[i] ? cols[i].trim() : "";
        });
        return obj;
    });

    return data;
}

/* ---------------------------------------------------------
   CSV BUILDER
   --------------------------------------------------------- */
function buildCSV(data) {
    if (!data || data.length === 0) return "";

    const header = Object.keys(data[0]).join(",");
    const rows = data.map(obj =>
        Object.values(obj)
            .map(v => `"${v}"`)
            .join(",")
    );

    return header + "\n" + rows.join("\n");
}

/* ---------------------------------------------------------
   DOWNLOAD FILE
   --------------------------------------------------------- */
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------
   FORMAT DATE/TIME
   --------------------------------------------------------- */
function formatDateTime(ts) {
    const d = new Date(ts);
    return (
        d.toLocaleDateString("de-CH") +
        " " +
        d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })
    );
}

/* ---------------------------------------------------------
   RANDOM STRING
   --------------------------------------------------------- */
function randomString(length = 8) {
    return Math.random().toString(36).substr(2, length);
}

/* ---------------------------------------------------------
   ARRAY REMOVE BY INDEX
   --------------------------------------------------------- */
function removeIndex(arr, index) {
    return arr.filter((_, i) => i !== index);
}

/* ---------------------------------------------------------
   CLEAN STRING
   --------------------------------------------------------- */
function cleanString(str) {
    return str ? str.trim() : "";
}
