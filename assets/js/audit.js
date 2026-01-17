/* =========================================================
   GOR – AUDIT MODULE
   Audit-Log: Laden, Filtern, Exportieren
   ========================================================= */

/* LOAD AUDIT LOG */
function loadAuditLog() {
    const saved = localStorage.getItem("gor_audit");
    if (saved) {
        GOR_STATE.audit = JSON.parse(saved);
    }

    const table = document.getElementById("audit-table");
    if (!table) return;

    table.innerHTML = "";

    const filterUser = document.getElementById("filter-user")?.value.toLowerCase() || "";
    const filterType = document.getElementById("filter-type")?.value || "";
    const filterDate = document.getElementById("filter-date")?.value || "";

    GOR_STATE.audit
        .filter(entry => {
            const matchesUser = filterUser === "" || entry.user.toLowerCase().includes(filterUser);
            const matchesType = filterType === "" || entry.type === filterType;
            const matchesDate = filterDate === "" || entry.timestamp.startsWith(filterDate);
            return matchesUser && matchesType && matchesDate;
        })
        .forEach(entry => {
            const row = document.createElement("tr");
            row.className = "audit-row";
            row.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.user}</td>
                <td>${entry.type}</td>
                <td>${entry.details}</td>
            `;
            table.appendChild(row);
        });
}

/* LOG AUDIT ENTRY */
function logAudit(type, details) {
    const entry = {
        timestamp: new Date().toISOString(),
        user: GOR_STATE.user?.username || "System",
        type,
        details
    };
    GOR_STATE.audit.push(entry);
    localStorage.setItem("gor_audit", JSON.stringify(GOR_STATE.audit));
    console.log(`[AUDIT] ${type}: ${details}`);
}

/* EXPORT AUDIT TO CSV */
function exportAuditCSV() {
    const rows = [
        ["Zeitpunkt", "Benutzer", "Typ", "Details"],
        ...GOR_STATE.audit.map(e => [
            new Date(e.timestamp).toLocaleString(),
            e.user,
            e.type,
            e.details
        ])
    ];

    const csvContent = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-log.csv";
    link.click();

    URL.revokeObjectURL(url);
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    loadAuditLog();
});
