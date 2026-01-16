/* =========================================================
   GOR PRODUCT ADMIN – STATE MANAGEMENT
   Benutzer, Session, Speicherung
   ========================================================= */

/* ---------------------------------------------------------
   DEFAULT USERS (falls keine existieren)
   --------------------------------------------------------- */
const DEFAULT_USERS = [
    { username: "admin", password: "admin", role: "admin" },
    { username: "mitarbeiter", password: "1234", role: "staff" }
];

/* ---------------------------------------------------------
   INITIALISIERUNG
   --------------------------------------------------------- */
function initUsers() {
    if (!localStorage.getItem("gor_users")) {
        localStorage.setItem("gor_users", JSON.stringify(DEFAULT_USERS));
    }
}
initUsers();

/* ---------------------------------------------------------
   BENUTZER VERWALTUNG
   --------------------------------------------------------- */
function getUsers() {
    return JSON.parse(localStorage.getItem("gor_users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("gor_users", JSON.stringify(users));
}

function addUser(username, password, role) {
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return { success: false, message: "Benutzer existiert bereits" };
    }

    users.push({ username, password, role });
    saveUsers(users);

    return { success: true };
}

function deleteUser(username) {
    let users = getUsers();
    users = users.filter(u => u.username !== username);
    saveUsers(users);
}

function updatePassword(username, newPassword) {
    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) return false;

    user.password = newPassword;
    saveUsers(users);
    return true;
}

/* ---------------------------------------------------------
   SESSION MANAGEMENT
   --------------------------------------------------------- */
function getSession() {
    return JSON.parse(localStorage.getItem("gor_session"));
}

function saveSession(session) {
    localStorage.setItem("gor_session", JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem("gor_session");
}

/* ---------------------------------------------------------
   PAGE INIT
   --------------------------------------------------------- */
function initPage() {
    const session = getSession();
    if (!session) return;

    console.log("Aktiver Benutzer:", session.user, "| Rolle:", session.role);
}
