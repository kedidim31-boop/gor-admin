/* =========================================================
   GOR PRODUCT ADMIN – AUDIT LOG (NEUE VERSION)
   Anzeige, Filter, Export + Icons + Badges
   ========================================================= */


/* ---------------------------------------------------------
   AUDIT LOG LADEN + FILTERN
   --------------------------------------------------------- */
function loadAuditLog() {
    let entries = getAuditLog(); // aus state.js

    const typeFilter = document.getElementById("filter-type")?.value.trim() || "";
    const userFilter = document.getElementById("filter-user")?.value.trim().toLowerCase() || "";
    const dateFilter = document.getElementById("filter-date")?.value || "";

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
   ICONS + BADGES MAPPING
   --------------------------------------------------------- */
function getAuditIcon(type) {
    return {
        "product_save": "💾",
        "product_delete": "🗑️",
        "login_success": "🔓",
        "login_fail": "⛔",
        "system": "⚙️"
    }[type] || "📄";
}

function getAuditBadgeClass(type) {
    return {
        "product_save": "audit-badge audit-save",
        "product_delete": "audit-badge audit-delete",
        "login_success": "audit-badge audit-login",
        "login_fail": "audit-badge audit-delete",
        "system": "audit-badge audit-system"
    }[type] || "audit-badge audit-system";
}


/* ---------------------------------------------------------
   TABELLE RENDERN (NEUE PREMIUM VERSION)
   --------------------------------------------------------- */
function renderAuditTable(entries) {
    const body = document.getElementById("audit-table");
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
        const icon = getAuditIcon(entry.type);
        const badgeClass = getAuditBadgeClass(entry.type);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${formatDateTime(entry.timestamp)}</td>
            <td>${entry.user}</td>
            <td>
                <span class="audit-icon">${icon}</span>
                <span class="${badgeClass}">${entry.type}</span>
            </td>
            <td class="audit-details">${entry.message}</td>
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
