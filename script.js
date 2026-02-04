/* ==========================================================
   GLOBAL STATE
========================================================== */
let currentUser = null;
let notificationTimeout;

/* ==========================================================
   WAIT FOR DOM LOAD
========================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- LOADING SCREEN ---------------- */
    setTimeout(() => {
        const loading = document.getElementById("loadingScreen");
        const loginPage = document.getElementById("loginPage");

        if (loading) loading.style.display = "none";
        if (loginPage) loginPage.classList.remove("hidden");
    }, 2000);

    /* ---------------- SIGNOUT BUTTON ---------------- */
    const signoutBtn = document.querySelector(".signout-btn");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", logout);
    }

    /* ---------------- PRIVACY CHECK ---------------- */
    const privacyCheck = document.getElementById("privacyCheck");
    const loginButton = document.getElementById("loginButton");

    if (privacyCheck && loginButton) {
        privacyCheck.addEventListener("change", function () {
            loginButton.disabled = !this.checked;
        });
    }

    /* ---------------- CONTACT FORM ---------------- */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", handleContactForm);
    }
});


/* ==========================================================
   AUTH SYSTEM
========================================================== */

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    const storedPassword = localStorage.getItem(username);

    if (storedPassword === password) {
        currentUser = username;

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("mainContent").classList.remove("hidden");

        updateAccountInfo();
    } else {
        alert("Invalid login. Please try again.");
    }
}

function signUp() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const email = document.getElementById("newEmail").value.trim();

    if (!username || !password || !email) {
        alert("Please fill in all fields.");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("Username already exists.");
        return;
    }

    localStorage.setItem(username, password);
    localStorage.setItem(`${username}_email`, email);

    currentUser = username;

    showMainContent();
    updateAccountInfo();
}

function logout() {
    currentUser = null;

    document.getElementById("mainContent").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

function showMainContent() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signUpPage").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
}


/* ==========================================================
   ACCOUNT INFO
========================================================== */

function updateAccountInfo() {
    if (!currentUser) return;

    const email = localStorage.getItem(`${currentUser}_email`);

    const nameField = document.getElementById("userDisplayName");
    const emailField = document.getElementById("userEmail");

    if (nameField) nameField.textContent = currentUser;
    if (emailField) emailField.textContent = email;
}


/* ==========================================================
   PAGE NAVIGATION
========================================================== */

function showLogin() {
    document.getElementById("signUpPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

function showSignUp() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signUpPage").classList.remove("hidden");
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }
}


/* ==========================================================
   NOTIFICATIONS
========================================================== */

function toggleNotifications() {
    const panel = document.getElementById("notificationPanel");
    if (!panel) return;

    if (panel.style.display === "block") {
        closeNotifications();
    } else {
        panel.style.display = "block";
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(closeNotifications, 10000);
    }
}

function closeNotifications() {
    const panel = document.getElementById("notificationPanel");
    if (panel) panel.style.display = "none";
}

function closeNotification(button) {
    const notification = button.closest(".notification");
    if (notification) notification.remove();
}


/* ==========================================================
   EVENTS SYSTEM
========================================================== */

function registerEvent(eventName, button) {

    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    const registeredList = document.getElementById("registered-events-list");

    // Prevent duplicate registration
    const existingEvents = registeredList.querySelectorAll("li");
    for (let item of existingEvents) {
        if (item.dataset.event === eventName) {
            alert("Already registered for this event.");
            return;
        }
    }

    button.disabled = true;
    button.textContent = "Registered";

    const li = document.createElement("li");
    li.className = "registered-event-item";
    li.dataset.event = eventName;
    li.textContent = eventName;

    const unregisterBtn = document.createElement("button");
    unregisterBtn.className = "unregister-btn";
    unregisterBtn.innerHTML = "❌";
    unregisterBtn.title = "Unregister";

    unregisterBtn.onclick = function () {
        unregisterEvent(li, button);
    };

    li.appendChild(unregisterBtn);
    registeredList.appendChild(li);
}

function unregisterEvent(listItem, registerButton) {
    listItem.remove();
    registerButton.disabled = false;
    registerButton.textContent = "Register";
}


/* ==========================================================
   EXTERNAL LINKS
========================================================== */

function openDocumentsPortal() {
    window.open("https://www.tcsion.com/SelfServices/", "_blank");
}

function composeEmail(email) {
    window.location.href = `mailto:${email}`;
}


/* ==========================================================
   CONTACT FORM
========================================================== */

async function handleContactForm(event) {
    event.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const message = document.getElementById("userMessage").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzsGUzu0KHaZOzZy5tLEBpc7hExXGZ3Mg8_QeB-hqmik8EnHqubsm7OuV104d1-cxH3/exec",
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    name: name,
                    email: email,
                    message: message
                })
            }
        );

        if (response.ok) {
            alert("Message sent successfully!");
            event.target.reset();
        } else {
            alert("Failed to send message.");
        }
    } catch (error) {
        alert("Error occurred. Please try again.");
    }
}
