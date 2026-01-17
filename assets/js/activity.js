/* =========================================================
   GOR PRODUCT ADMIN – ACTIVITY SCRIPT
   Lädt und filtert Audit-Log Aktivitäten
   ========================================================= */

/* ---------------------------------------------------------
   HELPER: Datum/Zeit formatieren
   --------------------------------------------------------- */
function formatDateTime(timestamp) {
    try {
        return new Date(timestamp).toLocaleString("de-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (e) {
        return timestamp;
    }
}

/* ---------------------------------------------------------
   AUDIT LOG LADEN
   --------------------------------------------------------- */
function getAuditLog() {
    return JSON.parse(localStorage.getItem("gor_audit") || "[]");
}

/* ---------------------------------------------------------
   AKTIVITÄTEN LADEN
   --------------------------------------------------------- */
function loadActivities() {
    const audit = getAuditLog();
    const container = document.getElementById("activity-list");
    if (!container) return;

    // Filter
    const filterUser = document.getElementById("filter-user")?.value.toLowerCase() || "";
    const filterType = document.getElementById("filter-type")?.value || "";
    const filterDate = document.getElementById("filter-date")?.value || "";

    container.innerHTML = "";

    audit
        .filter(entry => {
            const matchesUser = filterUser === "" || entry.user.toLowerCase().includes(filterUser);
            const matchesType = filterType === "" || entry.type === filterType;
            const matchesDate = filterDate === "" || entry.timestamp.startsWith(filterDate);
            return matchesUser && matchesType && matchesDate;
        })
        .slice(-20) // nur die letzten 20 Einträge
        .reverse()
        .forEach(entry => {
            const div = document.createElement("div");
            div.className = "activity-item";
            div.innerHTML = `
                <strong>${entry.user}</strong> – ${entry.type}<br>
                <span style="opacity:0.7">${formatDateTime(entry.timestamp)}</span>
                <p class="text-muted">${entry.details}</p>
            `;
            container.appendChild(div);
        });
}

/* ---------------------------------------------------------
   CSV EXPORT
   --------------------------------------------------------- */
function exportActivitiesCSV() {
    const audit = getAuditLog();
    const rows = [
        ["Zeitpunkt", "Benutzer", "Typ", "Details"],
        ...audit.map(e => [
            formatDateTime(e.timestamp),
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
    link.download = "activities.csv";
    link.click();

    URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadActivities();

    // Filter neu laden bei Änderungen
    const filterUser = document.getElementById("filter-user");
    const filterType = document.getElementById("filter-type");
    const filterDate = document.getElementById("filter-date");

    [filterUser, filterType, filterDate].forEach(el => {
        if (el) el.addEventListener("input", loadActivities);
    });
});
