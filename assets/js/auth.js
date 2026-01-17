/* =========================================================
   GOR PRODUCT ADMIN – AUTHENTIFIZIERUNG (NEUE VERSION)
   Login, Logout, Rollenprüfung, Session, Avatar, Dropdown
   ========================================================= */


/* ---------------------------------------------------------
   USER VERWALTUNG
   --------------------------------------------------------- */
function getUsers() {
    const stored = localStorage.getItem("gor_users");

    if (!stored) {
        // Standard-Benutzer (falls keine gespeichert sind)
        return [
            { username: "admin", password: "admin", role: "admin" },
            { username: "mitarbeiter", password: "1234", role: "staff" }
        ];
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        return [];
    }
}


/* ---------------------------------------------------------
   SESSION HANDLING
   --------------------------------------------------------- */
function saveSession(session) {
    localStorage.setItem("gor_session", JSON.stringify(session));
}

function getSession() {
    return JSON.parse(localStorage.getItem("gor_session"));
}

function clearSession() {
    localStorage.removeItem("gor_session");
}


/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Login fehlgeschlagen – bitte überprüfe deine Eingaben.");
        logAudit("login_fail", `Login fehlgeschlagen für Benutzer: ${username}`);
        return { success: false };
    }

    saveSession({
        user: user.username,
        role: user.role,
        loginTime: Date.now()
    });

    logAudit("login_success", `Benutzer ${user.username} hat sich eingeloggt`);

    return { success: true, role: user.role };
}


/* ---------------------------------------------------------
   LOGOUT
   --------------------------------------------------------- */
function logout() {
    const session = getSession();

    if (session) {
        logAudit("logout", `Benutzer ${session.user} hat sich ausgeloggt`);
    }

    clearSession();
    window.location.href = "index.html";
}


/* ---------------------------------------------------------
   LOGIN ERFORDERLICH
   --------------------------------------------------------- */
function requireLogin() {
    const session = getSession();
    if (!session || !session.user) {
        alert("Bitte melde dich zuerst an.");
        window.location.href = "index.html";
    }
}


/* ---------------------------------------------------------
   ROLLEN ERFORDERLICH
   --------------------------------------------------------- */
function requireRole(role) {
    const session = getSession();
    if (!session || session.role !== role) {
        alert("Du hast keine Berechtigung für diesen Bereich.");
        window.location.href = "index.html";
    }
}


/* =========================================================
   HEADER AVATAR + DROPDOWN
   ========================================================= */

/* Avatar Initialen aus Login generieren */
function loadUserAvatar() {
    const session = getSession();
    if (!session || !session.user) return;

    const avatar = document.querySelector(".header-avatar");
    if (!avatar) return;

    avatar.textContent = session.user.charAt(0).toUpperCase();
}

/* Dropdown öffnen/schließen */
function toggleUserDropdown() {
    const menu = document.getElementById("user-dropdown");
    if (!menu) return;

    menu.classList.toggle("show");
}

/* Dropdown schließen, wenn man außerhalb klickt */
document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("user-dropdown");
    const avatar = document.querySelector(".header-user");

    if (!dropdown || !avatar) return;

    if (!avatar.contains(event.target)) {
        dropdown.classList.remove("show");
    }
});


/* ---------------------------------------------------------
   Wird auf jeder Seite ausgeführt
   --------------------------------------------------------- */
function initPage() {
    requireLogin();
    loadUserAvatar();
}
