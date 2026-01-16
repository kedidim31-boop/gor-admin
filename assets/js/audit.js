/* =========================================================
   GOR PRODUCT ADMIN – AUDIT SYSTEM
   Icons, Farben, Filter, Suche, Pagination, CSV Export
   ========================================================= */

/* ---------------------------------------------------------
   AUDIT LOG LADEN & SPEICHERN
   --------------------------------------------------------- */
function getAuditLog() {
    return JSON.parse(localStorage.getItem("gor_audit")) || [];
}

function addAuditEntry(action, details = "") {
    const session = getSession();
    const user = session ? session.user : "Unbekannt";
    const role = session ? session.role : "none";

    const log = getAuditLog();

    log.push({
        timestamp: Date.now(),
        user: user,
        role: role,
        action: action,
        details: details
    });

    localStorage.setItem("gor_audit", JSON.stringify(log));
}

/* ---------------------------------------------------------
   ICONS & FARBEN
   --------------------------------------------------------- */
function getAuditIcon(entry) {
    if (entry.action === "login") return "🔐";
    if (entry.action === "logout") return "🚪";
    if (entry.action.includes("Produkt")) return "📦";
    if (entry.action.includes("CSV")) return "📄";
    if (entry.action.includes("Einstellung")) return "⚙️";
    return "📝";
}

function getAuditColor(entry) {
    if (entry.action === "login") return "var(--color-success)";
    if (entry.action === "logout") return "var(--color-danger)";
    if (entry.action.includes("Produkt")) return "var(--color-primary)";
    if (entry.action.includes("CSV")) return "var(--color-info)";
    if (entry.action.includes("Einstellung")) return "var(--color-warning)";
    return "var(--color-text)";
}

/* ---------------------------------------------------------
   FILTER & SUCHE
   --------------------------------------------------------- */
function filterAuditLog(type = "all", search = "") {
    let log = getAuditLog();

    // Kategorie
    if (type !== "all") {
        log = log.filter(entry => {
            if (type === "login") return entry.action === "login";
            if (type === "logout") return entry.action === "logout";
            if (type === "product") return entry.action.includes("Produkt");
            if (type === "csv") return entry.action.includes("CSV");
            if (type === "settings") return entry.action.includes("Einstellung");
            return true;
        });
    }

    // Suche
    if (search.trim() !== "") {
        const s = search.toLowerCase();
        log = log.filter(entry =>
            entry.user.toLowerCase().includes(s) ||
            entry.role.toLowerCase().includes(s) ||
            entry.action.toLowerCase().includes(s) ||
            entry.details.toLowerCase().includes(s)
        );
    }

    return log;
}

/* ---------------------------------------------------------
   PAGINATION
   --------------------------------------------------------- */
let auditPage = 1;
const auditPerPage = 20;

/* ---------------------------------------------------------
   TABELLE RENDERN
   --------------------------------------------------------- */
function renderAuditTable(filterType = "all", search = "") {
    const tbody = document.getElementById("audit-table-body");
    if (!tbody) return;

    const log = filterAuditLog(filterType, search);

    const start = (auditPage - 1) * auditPerPage;
    const end = start + auditPerPage;
    const pageLog = log.slice(start, end);

    tbody.innerHTML = "";

    pageLog.forEach(entry => {
        const tr = document.createElement("tr");
        tr.classList.add("fade-in");

        tr.innerHTML = `
            <td class="audit-icon" style="color:${getAuditColor(entry)}">${getAuditIcon(entry)}</td>
            <td>${formatDateTime(entry.timestamp)}</td>
            <td>${entry.user}</td>
            <td>${entry.role}</td>
            <td>${entry.action}</td>
            <td>${entry.details}</td>
        `;

        tbody.appendChild(tr);
    });

    renderAuditPagination(log.length);
}

/* ---------------------------------------------------------
   PAGINATION RENDERN
   --------------------------------------------------------- */
function renderAuditPagination(total) {
    const container = document.getElementById("audit-pagination");
    if (!container) return;

    const pages = Math.ceil(total / auditPerPage);

    container.innerHTML = "";

    if (pages <= 1) return;

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === auditPage) ? "primary" : "";
        btn.onclick = () => {
            auditPage = i;
            renderAuditTable(
                document.getElementById("audit-filter-type").value,
                document.getElementById("audit-filter-search").value
            );
        };
        container.appendChild(btn);
    }
}

/* ---------------------------------------------------------
   CSV EXPORT
   --------------------------------------------------------- */
function exportAuditToCSV() {
    const log = getAuditLog();

    if (log.length === 0) {
        alert("Keine Audit-Daten vorhanden.");
        return;
    }

    const csvData = log.map(entry => ({
        timestamp: formatDateTime(entry.timestamp),
        user: entry.user,
        role: entry.role,
        action: entry.action,
        details: entry.details
    }));

    const csv = buildCSV(csvData);
    downloadFile("audit-log.csv", csv);

    addAuditEntry("CSV Export", "Audit-Log exportiert.");
}
