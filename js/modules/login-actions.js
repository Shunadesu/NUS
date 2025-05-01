// ========== AUTH LOGIC START ==========

const USER_STORAGE_KEY = 'loggedInUserEmail';

// Core auth functions
export function isLoggedIn() {
    return localStorage.getItem(USER_STORAGE_KEY) !== null;
}

export function getLoggedInUserEmail() {
    return localStorage.getItem(USER_STORAGE_KEY);
}

export function loginUser(email) {
    localStorage.setItem(USER_STORAGE_KEY, email);
    window.location.href = '/pages/account.html';
}

export function logoutUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = '/pages/login.html';
}

// Page initialization functions
function initAccountLinks() {
    const accountLinks = document.querySelectorAll('a[href*="account.html"], button[aria-label="Account"]');
    accountLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = isLoggedIn() ? '/pages/account.html' : '/pages/login.html';
        });
    });
}

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (emailInput.value && passwordInput.value) {
            loginUser(emailInput.value);
        } else {
            alert('Please enter both email and password.');
        }
    });

    const createAccountBtnLogin = document.getElementById('create-account-btn');
    if (createAccountBtnLogin) {
        createAccountBtnLogin.addEventListener('click', () => {
            window.location.href = '/pages/register.html';
        });
    }
}

function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const firstNameInput = document.getElementById('register-first-name');
        const lastNameInput = document.getElementById('register-last-name');

        if (emailInput.value && passwordInput.value && firstNameInput.value && lastNameInput.value) {
            alert('Account created successfully! Please log in.');
            window.location.href = '/pages/login.html';
        } else {
            alert('Please fill in all required fields.');
        }
    });

    const goToLoginBtn = document.getElementById('go-to-login-btn');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => {
            window.location.href = '/pages/login.html';
        });
    }
}

function initAccountPage() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    if (!isLoggedIn()) {
        window.location.href = '/pages/login.html';
        return;
    }

    const userEmailSpan = document.getElementById('account-email');
    if (userEmailSpan) {
        userEmailSpan.textContent = getLoggedInUserEmail();
    }
    
    logoutBtn.addEventListener('click', logoutUser);
}

function cleanupOldLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (!loginModal) return;

    const openLoginModalBtn = document.querySelector('.open-login-modal-button');
    if (openLoginModalBtn) {
        console.warn("Old login modal trigger might still exist. Please remove its event listener.");
    }
    loginModal.remove();
}

// Main initialization function
export function initLoginActions() {
    initAccountLinks();
    initLoginPage();
    initRegisterPage();
    initAccountPage();
    cleanupOldLoginModal();
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initLoginActions);
