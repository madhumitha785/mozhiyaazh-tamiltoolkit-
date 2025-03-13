// auth.js - Handles user authentication functionality

document.addEventListener("DOMContentLoaded", function () {
    // Get the signup and login forms
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("name").value.trim();
            const emailInput = document.getElementById("email").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            if (!nameInput || !emailInput || !passwordInput) {
                alert("Please fill in all fields.");
                return;
            }

            let users = JSON.parse(localStorage.getItem("mozhiyaazh_users")) || [];

            // Check if user already exists
            if (users.some((user) => user.email === emailInput)) {
                alert("Email already registered. Please login.");
                return;
            }

            // Store new user
            users.push({ name: nameInput, email: emailInput, password: passwordInput });
            localStorage.setItem("mozhiyaazh_users", JSON.stringify(users));

            alert("Signup successful! Redirecting to login.");
            window.location.href = "/login";
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = document.getElementById("email").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            if (!emailInput || !passwordInput) {
                alert("Please enter both email and password.");
                return;
            }

            let users = JSON.parse(localStorage.getItem("mozhiyaazh_users")) || [];

            const foundUser = users.find((user) => user.email === emailInput && user.password === passwordInput);

            if (foundUser) {
                localStorage.setItem("mozhiyaazh_loggedIn", JSON.stringify(foundUser));
                alert("Login successful! Redirecting to home page.");
                window.location.href = "/home";
            } else {
                alert("Invalid email or password.");
            }
        });
    }
});
