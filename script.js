// Wait for the document to load
document.addEventListener("DOMContentLoaded", () => {
    // Simulate loading screen for 2 seconds before displaying the login page
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none"; // Hide loading screen
        document.getElementById("loginPage").classList.remove("hidden"); // Show login page
    }, 2000);
});

// Login function that checks credentials from localStorage
function login() {
    const username = document.getElementById("username").value; // Get username from login form
    const password = document.getElementById("password").value; // Get password from login form

    // Check if credentials match what's stored in localStorage
    if (localStorage.getItem(username) === password) {
        // Hide login page and show main content on successful login
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("mainContent").classList.remove("hidden");

        // Display username on the account page
        document.getElementById("userDisplayName").textContent = username;
    } else {
        alert("Invalid login. Please try again."); // Show alert on invalid login
    }
}

// Sign-Up function that stores user data in localStorage
function signUp() {
    // Get values from the sign-up form
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const email = document.getElementById('newEmail').value;  // Get email value

    // Check if all required fields are filled out
    if (username && password && email) {
        // Store the new user's data in localStorage
        localStorage.setItem(username, password); // Store password by username
        localStorage.setItem(`${username}_email`, email); // Store email by username

        // Show account page after successful sign up
        showPage('account');
        updateAccountInfo();
    } else {
        alert('Please fill in all fields'); // Alert if any field is missing
    }
}

// Update account info on the account page
function updateAccountInfo() {
    // Get stored user data from localStorage
    const username = document.getElementById('newUsername').value;
    const email = localStorage.getItem(`${username}_email`); // Retrieve email by username
    
    // Display username and email on account page
    document.getElementById('userDisplayName').textContent = username;
    document.getElementById('userEmail').textContent = email;
}

// Switch to the login page
function showLogin() {
    document.getElementById("signUpPage").classList.add("hidden"); // Hide sign-up page
    document.getElementById("loginPage").classList.remove("hidden"); // Show login page
}

// Switch to the sign-up page
function showSignUp() {
    document.getElementById("loginPage").classList.add("hidden"); // Hide login page
    document.getElementById("signUpPage").classList.remove("hidden"); // Show sign-up page
}

// Logout function to hide main content and show login page
function logout() {
    document.getElementById("mainContent").classList.add("hidden"); // Hide main content
    document.getElementById("loginPage").classList.remove("hidden"); // Show login page
}

// Function to show a particular page by its ID (Home, Events, Account, etc.)
function showPage(pageId) {
    // Hide all pages first
    document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));

    // Show the selected page
    document.getElementById(pageId).classList.remove("hidden");
}

// Toggle the visibility of the notification panel
function toggleNotifications() {
    const panel = document.getElementById("notificationPanel");
    panel.classList.toggle("active"); // Toggle the active class to show or hide the notifications
}

// Close the notification panel
function closeNotifications() {
    document.getElementById("notificationPanel").classList.remove("active"); // Remove the active class to hide the panel
}

// Open the TCS iON portal in a new tab
function openDocumentsPortal() {
    window.open("https://www.tcsion.com/SelfServices/", "_blank"); // Open the portal URL in a new window/tab
}

// Enable the login button only if the privacy policy checkbox is checked
const privacyCheck = document.getElementById("privacyCheck");
const loginBtn = document.getElementById("loginButton");

privacyCheck.addEventListener("change", () => {
    loginBtn.disabled = !privacyCheck.checked; // Disable login button if privacy policy is not agreed
});

// Function to compose an email (opens user's default mail client with the email)
function composeEmail(email) {
    window.location.href = `mailto:${email}`; // Open the default email client with the email as the recipient
}

// Register event function that disables the button and adds the event to the registered list
function registerEvent(eventName, button) {
    // Disable the register button and change its appearance
    button.disabled = true;
    button.style.backgroundColor = "#aaa";
    button.textContent = "Registered";

    // Create a list item for the registered event
    const li = document.createElement("li");
    li.className = "registered-event-item";
    li.textContent = eventName;

    // Create the ❌ unregister button
    const unregisterBtn = document.createElement("button");
    unregisterBtn.className = "unregister-btn";
    unregisterBtn.innerHTML = "❌"; // Cross mark for unregister
    unregisterBtn.title = "Unregister"; // Title on hover
    unregisterBtn.onclick = function () {
        unregisterEvent(unregisterBtn); // Unregister event on button click
    };

    li.appendChild(unregisterBtn); // Append unregister button to the list item

    // Add the event to the registered events list on the account page
    document.getElementById("registered-events-list").appendChild(li);
}

// Unregister event function that removes the event from the list
function unregisterEvent(button) {
    const li = button.parentElement; // Get the <li> of the event
    li.remove(); // Remove the event from the list
}


let notificationTimeout;

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block'; // Show panel
        clearTimeout(notificationTimeout); // Reset timeout when panel is opened
        notificationTimeout = setTimeout(closeNotifications, 10000); // Auto-close after 10 seconds
    } else {
        closeNotifications();
    }
}

function closeNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.style.display = 'none'; // Hide panel
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.style.display = 'none'; // Close individual notification
}
