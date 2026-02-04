// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    // Simulated Loading Screen
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("loginPage").classList.remove("hidden");
    }, 1500);

    // Attach Sign Out Button
    const signOutBtn = document.querySelector(".signout-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", logout);
    }

    // Privacy Checkbox Control
    const privacyCheck = document.getElementById("privacyCheck");
    if (privacyCheck) {
        privacyCheck.addEventListener("change", function () {
            document.getElementById("loginButton").disabled = !this.checked;
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactForm);
    }

});


// ===============================
// AUTHENTICATION
// ===============================

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {

        localStorage.setItem("loggedInUser", username);

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("authPages").classList.add("hidden");
        document.getElementById("mainContent").classList.remove("hidden");

        document.getElementById("userDisplayName").textContent = username;

        showPage("home");

    } else {
        alert("Invalid login credentials.");
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
    localStorage.setItem("loggedInUser", username);

    alert("Account created successfully!");

    document.getElementById("signUpPage").classList.add("hidden");
    document.getElementById("authPages").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");

    document.getElementById("userDisplayName").textContent = username;

    showPage("home");
}

function logout() {
    localStorage.removeItem("loggedInUser");

    document.getElementById("mainContent").classList.add("hidden");
    document.getElementById("authPages").classList.remove("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }
}


// ===============================
// NOTIFICATIONS
// ===============================

let notificationTimeout;

function toggleNotifications() {
    const panel = document.getElementById("notificationPanel");

    if (!panel) return;

    if (panel.style.display === "block") {
        closeNotifications();
    } else {
        panel.style.display = "block";
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(closeNotifications, 8000);
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


// ===============================
// EVENTS SYSTEM
// ===============================

function registerEvent(eventName, button) {

    button.disabled = true;
    button.classList.add("registered");
    button.textContent = "Registered";

    const li = document.createElement("li");
    li.textContent = eventName;

    const unregisterBtn = document.createElement("button");
    unregisterBtn.textContent = "❌";
    unregisterBtn.className = "unregister-btn";

    unregisterBtn.onclick = function () {
        li.remove();
        button.disabled = false;
        button.classList.remove("registered");
        button.textContent = "Register";
    };

    li.appendChild(unregisterBtn);

    document.getElementById("registered-events-list").appendChild(li);
}


// ===============================
// DOCUMENTS
// ===============================

function openDocumentsPortal() {
    window.open("https://www.tcsion.com/SelfServices/", "_blank");
}


// ===============================
// EMAIL
// ===============================

function composeEmail(email) {
    window.location.href = `mailto:${email}`;
}


// ===============================
// CONTACT FORM
// ===============================

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
        const response = await fetch("https://script.google.com/macros/s/AKfycbzsGUzu0KHaZOzZy5tLEBpc7hExXGZ3Mg8_QeB-hqmik8EnHqubsm7OuV104d1-cxH3/exec", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                name,
                email,
                message
            })
        });

        if (response.ok) {
            alert("Message sent successfully!");
            document.getElementById("contactForm").reset();
        } else {
            alert("Failed to send message.");
        }

    } catch (error) {
        alert("Network error. Try again.");
    }
}
