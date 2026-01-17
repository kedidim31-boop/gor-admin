/* =========================================================
   GOR ULTRA CYBER – AUDIT LOG (FUSION VERSION)
   Filter + Icons + Badges + Timeline + Expandable Details
   ========================================================= */

let auditData = [];

/* ---------------------------------------------------------
   AUDIT LOG LADEN + FILTERN
   --------------------------------------------------------- */
function loadAuditLog() {
    auditData = getAuditLog(); // aus state.js

    applyAuditFilters();
}

/* Hauptfilter-Funktion */
function applyAuditFilters() {
    let entries = [...auditData];

    const typeFilter = document.getElementById("filter-type")?.value.trim() || "";
    const userFilter = document.getElementById("filter-user")?.value.trim().toLowerCase() || "";
    const dateFilter = document.getElementById("filter-date")?.value || "";

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
    renderTimeline(entries);
}

/* Live-Filter */
function filterAudit() {
    applyAuditFilters();
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
   TIMELINE RENDERN (ULTRA CYBER)
   --------------------------------------------------------- */
function renderTimeline(entries) {
    const timeline = document.querySelector(".audit-timeline");
    if (!timeline) return;

    timeline.innerHTML = "";

    entries.forEach(entry => {
        const dot = document.createElement("div");
        dot.className = "timeline-dot " + entry.type;
        dot.title = `${formatDateTime(entry.timestamp)} – ${entry.action || entry.type}`;
        timeline.appendChild(dot);
    });
}


/* ---------------------------------------------------------
   TABELLE RENDERN (ULTRA CYBER + DEINE LOGIK)
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

    entries.forEach((entry, index) => {
        const icon = getAuditIcon(entry.type);
        const badgeClass = getAuditBadgeClass(entry.type);

        /* Hauptzeile */
        const row = document.createElement("tr");
        row.className = "audit-row " + entry.type;
        row.onclick = () => toggleDetails(index);

        row.innerHTML = `
            <td>${formatDateTime(entry.timestamp)}</td>
            <td><span class="audit-user">${entry.user}</span></td>
            <td>
                <span class="audit-icon">${icon}</span>
                <span class="${badgeClass}">${entry.type}</span>
            </td>
            <td class="audit-expand">▼</td>
        `;

        /* Detailzeile */
        const details = document.createElement("tr");
        details.className = "audit-details-row";
        details.id = "details-" + index;

        details.innerHTML = `
            <td colspan="4">
                <div class="audit-details-box">
                    <strong>Nachricht:</strong><br>
                    ${entry.message}<br><br>

                    <strong>Rohdaten:</strong><br>
                    <pre>${JSON.stringify(entry, null, 2)}</pre>
                </div>
            </td>
        `;

        body.appendChild(row);
        body.appendChild(details);
    });
}


/* ---------------------------------------------------------
   DETAILS EIN-/AUSKLAPPEN
   --------------------------------------------------------- */
function toggleDetails(index) {
    const row = document.getElementById("details-" + index);
    row.classList.toggle("open");
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
