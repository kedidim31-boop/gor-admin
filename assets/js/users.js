/* =========================================================
   GOR PRODUCT ADMIN – USER MODULE
   Benutzerverwaltung: Laden, Speichern, Hinzufügen, Löschen, Passwort ändern
   ========================================================= */

/* ---------------------------------------------------------
   BENUTZER LADEN
   --------------------------------------------------------- */
function getUsers() {
    const stored = localStorage.getItem("gor_users");

    if (!stored) {
        // Standard-Benutzer (Fallback)
        return [
            { username: "admin", password: "admin", role: "admin" },
            { username: "mitarbeiter", password: "1234", role: "staff" }
        ];
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Fehler beim Laden der Benutzer:", e);
        return [];
    }
}

/* ---------------------------------------------------------
   BENUTZER SPEICHERN
   --------------------------------------------------------- */
function saveUsers(users) {
    localStorage.setItem("gor_users", JSON.stringify(users));
}

/* ---------------------------------------------------------
   BENUTZER HINZUFÜGEN
   --------------------------------------------------------- */
function addUser(username, password, role = "staff") {
    let users = getUsers();

    if (users.find(u => u.username === username)) {
        return { success: false, message: "Benutzername bereits vergeben." };
    }

    const newUser = { username, password, role };
    users.push(newUser);
    saveUsers(users);

    logAudit("user_create", `Benutzer erstellt: ${username}`);
    return { success: true, message: "Benutzer erfolgreich erstellt." };
}

/* ---------------------------------------------------------
   BENUTZER LÖSCHEN
   --------------------------------------------------------- */
function deleteUser(username) {
    let users = getUsers();
    const filtered = users.filter(u => u.username !== username);

    if (filtered.length === users.length) {
        return { success: false, message: "Benutzer nicht gefunden." };
    }

    saveUsers(filtered);
    logAudit("user_delete", `Benutzer gelöscht: ${username}`);
    return { success: true, message: "Benutzer erfolgreich gelöscht." };
}

/* ---------------------------------------------------------
   PASSWORT ÄNDERN
   --------------------------------------------------------- */
function updatePassword(username, newPassword) {
    let users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return { success: false, message: "Benutzer nicht gefunden." };
    }

    user.password = newPassword;
    saveUsers(users);

    logAudit("user_pwchange", `Passwort geändert für: ${username}`);
    return { success: true, message: "Passwort erfolgreich geändert." };
}

/* ---------------------------------------------------------
   ROLLEN ÄNDERN
   --------------------------------------------------------- */
function updateRole(username, newRole) {
    let users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return { success: false, message: "Benutzer nicht gefunden." };
    }

    user.role = newRole;
    saveUsers(users);

    logAudit("user_rolechange", `Rolle geändert für: ${username} → ${newRole}`);
    return { success: true, message: "Rolle erfolgreich geändert." };
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // Falls keine Benutzer gespeichert sind → Default setzen
    if (!localStorage.getItem("gor_users")) {
        saveUsers([
            { username: "admin", password: "admin", role: "admin" },
            { username: "mitarbeiter", password: "1234", role: "staff" }
        ]);
    }
});
