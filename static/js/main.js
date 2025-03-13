// main.js - Shared functionality across the site

document.addEventListener('DOMContentLoaded', function() {
    console.log('Mozhiyaazh app initialized');
    
    // Detect if user is logged in (check localStorage for demo purposes)
    function isLoggedIn() {
        return localStorage.getItem('mozhiyaazh_user') !== null;
    }
    
    // Handle logout if logout link is present
    const logoutLink = document.querySelector('a[href="index.html"]');
    if (logoutLink && logoutLink.textContent.includes('LOGOUT')) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('mozhiyaazh_user');
            window.location.href = 'index.html';
        });
    }
    
    // Redirect to login page if user tries to access protected pages without being logged in
    const protectedPages = ['home.html', 'speech-to-text.html', 'text-to-speech.html', 'image_to_text.html'];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = '/login';
    }
});