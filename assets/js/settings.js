/* =========================================================
   GOR PRODUCT ADMIN – BENUTZERVERWALTUNG
   Benutzerliste, Passwort ändern, löschen, erstellen
   ========================================================= */

/* ---------------------------------------------------------
   BENUTZERLISTE LADEN
   --------------------------------------------------------- */
function loadUserList() {
    const users = getUsers();
    const container = document.getElementById("user-list");

    container.innerHTML = "";

    users.forEach(u => {
        container.innerHTML += `
            <div class="flex-between mb-10 user-row">
                <div class="flex gap-10">
                    <strong>${u.username}</strong>
                    <span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}">
                        ${u.role}
                    </span>
                </div>

                <div class="table-actions flex gap-10">
                    <button onclick="openPasswordModal('${u.username}')">Passwort ändern</button>
                    <button class="danger" onclick="deleteUserConfirm('${u.username}')">Löschen</button>
                </div>
            </div>
        `;
    });
}

/* ---------------------------------------------------------
   NEUEN BENUTZER ERSTELLEN
   --------------------------------------------------------- */
function createNewUser() {
    const name = document.getElementById("new-user-name").value.trim();
    const pass = document.getElementById("new-user-pass").value.trim();
    const role = document.getElementById("new-user-role").value;

    if (name.length < 3 || pass.length < 3) {
        showToast("Benutzername und Passwort müssen mindestens 3 Zeichen haben", "error");
        return;
    }

    const result = addUser(name, pass, role);

    if (!result.success) {
        showToast(result.message, "error");
        return;
    }

    addAuditEntry("Einstellung", `Benutzer erstellt: ${name}`);

    showToast("Benutzer erfolgreich erstellt", "success");

    document.getElementById("new-user-name").value = "";
    document.getElementById("new-user-pass").value = "";

    loadUserList();
}

/* ---------------------------------------------------------
   BENUTZER LÖSCHEN (MIT BESTÄTIGUNG)
   --------------------------------------------------------- */
function deleteUserConfirm(username) {
    confirmModal(
        `Benutzer "${username}" wirklich löschen?`,
        () => {
            deleteUser(username);
            addAuditEntry("Einstellung", `Benutzer gelöscht: ${username}`);
            loadUserList();
            showToast("Benutzer gelöscht", "success");
        }
    );
}

/* ---------------------------------------------------------
   PASSWORT ÄNDERN – MODAL ÖFFNEN
   --------------------------------------------------------- */
function openPasswordModal(username) {
    showModal(
        "Passwort ändern",
        `
            <div class="form-group">
                <label>Neues Passwort</label>
                <input type="password" id="pw-change-input">
            </div>
        `,
        `
            <button class="primary" onclick="changePassword('${username}')">Speichern</button>
            <button onclick="closeModal()">Abbrechen</button>
        `
    );
}

/* ---------------------------------------------------------
   PASSWORT ÄNDERN – SPEICHERN
   --------------------------------------------------------- */
function changePassword(username) {
    const newPass = document.getElementById("pw-change-input").value.trim();

    if (newPass.length < 3) {
        showToast("Passwort zu kurz", "error");
        return;
    }

    updatePassword(username, newPass);

    addAuditEntry("Einstellung", `Passwort geändert für: ${username}`);

    closeModal();
    showToast("Passwort erfolgreich geändert", "success");

    loadUserList();
}
