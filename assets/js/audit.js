/* =========================================================
   GOR PRODUCT ADMIN – AUDIT LOG (NEUE VERSION)
   Anzeige, Filter, Export
   ========================================================= */


/* ---------------------------------------------------------
   AUDIT LOG LADEN + FILTERN
   --------------------------------------------------------- */
function loadAuditLog() {
    let entries = getAuditLog(); // aus state.js

    const typeFilter = document.getElementById("filter-type").value.trim();
    const userFilter = document.getElementById("filter-user").value.trim().toLowerCase();
    const dateFilter = document.getElementById("filter-date").value;

    // Filter anwenden
    entries = entries.filter(entry => {

        if (typeFilter && entry.type !== typeFilter) return false;

        if (userFilter && !entry.user.toLowerCase().includes(userFilter)) return false;

        if (dateFilter) {
            const entryDate = entry.timestamp.split("T")[0];
            if (entryDate !== dateFilter) return false;
        }

        return true;
    });

    renderAuditTable(entries);
}


/* ---------------------------------------------------------
   TABELLE RENDERN
   --------------------------------------------------------- */
function renderAuditTable(entries) {
    const body = document.getElementById("audit-body");
    body.innerHTML = "";

    if (entries.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; opacity:0.6;">
                    Keine Einträge gefunden
                </td>
            </tr>`;
        return;
    }

    entries.forEach(entry => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${formatDateTime(entry.timestamp)}</td>
            <td>${entry.type}</td>
            <td>${entry.user}</td>
            <td>${entry.message}</td>
        `;

        body.appendChild(row);
    });
}


/* ---------------------------------------------------------
   CSV EXPORT
   --------------------------------------------------------- */
function exportAuditCSV() {
    const entries = getAuditLog();
    if (entries.length === 0) return;

    let csv = "Zeit;Typ;Benutzer;Nachricht\n";

    entries.forEach(e => {
        csv += `${formatDateTime(e.timestamp)};${e.type};${e.user};${e.message}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();

    URL.revokeObjectURL(url);
}
