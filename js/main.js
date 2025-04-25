import { setupPageLoader, handlePageLoad } from './modules/loader.js';
import { setupNavigation } from './modules/navigation.js';
import { initPriceSlider, setupHeroSlider } from './modules/slider.js';
import { setupSearch, submitSearch } from './modules/search.js';
import { initModals } from './modules/modal.js';
import { initUI } from './modules/ui.js';
import { initProducts } from './modules/products.js';
import { initCart } from './modules/cart.js';
import { initPagination } from './modules/pagnigation.js';                 
import { initProductOptions } from './modules/product-options.js';
import { initFullscreenGallery } from './modules/fullscreen-gallery.js';
import { initGallery } from './modules/gallery.js';
import { initNotifications } from './modules/notification.js';
import { initFilters } from './modules/filter.js';
import { initFooterFunctionality } from './modules/footer.js';
import { init404Page } from './modules/404.js';
import { createTestimonialSlider } from './modules/testimonial.js';
import ScrollHandler from './modules/scroll-handler.js';
import { initCounterAnimation } from './components/counter-animation.js';


document.addEventListener('DOMContentLoaded', function() {
  initFooterFunctionality();
  setupPageLoader();
  setupNavigation();
  setupHeroSlider();
  setupSearch();
  submitSearch();
  initUI();

  const testimonialContainer = document.querySelector('.testimonial-container');
  if (testimonialContainer) {
    const testimonialSlider = createTestimonialSlider(testimonialContainer);
  }
  initPriceSlider();
  initCart();
  initNotifications();
  initModals();
  initProducts();
  initFilters();
  initPagination();
  initGallery();
  initFullscreenGallery();
  initProductOptions();
  initFooterFunctionality();
  ScrollHandler.init();
  if (document.querySelector('.error-page')) {
    init404Page();
  }
  console.log('[Debug] Initialization complete');

  // Initialize counter animation
  initCounterAnimation();
});

// Handle page load
window.addEventListener('load', handlePageLoad);

// You could add image lazy loading here
document.addEventListener('DOMContentLoaded', function() {
  // Initialize any JavaScript functionality
  
  // Example: Add animation classes when elements come into view
  const categories = document.querySelectorAll('.category');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  categories.forEach(category => {
    category.style.opacity = 0;
    category.style.transform = 'translateY(20px)';
    category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(category);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const sidebar = document.querySelector('.sidebar');

  const mainnav = document.querySelector('.nav__list');
  const logoWhite = document.querySelector('.logo_div.white');
  const logoNormal = document.querySelector('.logo_div:not(.white)');
  let lastScrollTop = 0;+
 
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 0) {
      if (currentScroll > lastScrollTop) {
        // Cuộn xuống
        header.classList.add('shrink');
        sidebar.classList.add('hide');
        mainnav.classList.remove('main_nav');


         // Toggle logo visibility
         logoWhite.style.display = 'none';
         logoNormal.style.display = 'block';
      } else {
        // Cuộn lên
        // header.classList.remove('shrink');
        // sidebar.classList.remove('hide');
        // mainnav.classList.add('main_nav');
       
      }
    }if (currentScroll === 0) {
      header.classList.remove('shrink');
      sidebar.classList.remove('hide');
      mainnav.classList.add('main_nav');
      logoWhite.style.display = 'block';
      logoNormal.style.display = 'none';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // prevent negative scroll
  });

});

document.addEventListener('DOMContentLoaded', function() {
  // Get all the elements we need
  const sizeOptions = document.querySelectorAll('.size-selector__option');
  const currentSizeElement = document.querySelector('.size-selector__current');
  
  // Add click event listeners to each size option
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Get the size from the data attribute
      const selectedSize = this.dataset.size;
      
      // Update the current size display
      if (currentSizeElement) {
        currentSizeElement.textContent = selectedSize;
      }
      
      // Remove active class from all options
      sizeOptions.forEach(opt => {
        opt.classList.remove('size-selector__option--active');
      });
      
      // Add active class to the clicked option
      this.classList.add('size-selector__option--active');
      
      // Optional: dispatch custom event for integration with other components
      const event = new CustomEvent('sizeChange', {
        detail: {
          size: selectedSize
        }
      });
      document.dispatchEvent(event);
      
      // Optional: Update any hidden form fields if this is part of a form
      const sizeInput = document.querySelector('input[name="size"]');
      if (sizeInput) {
        sizeInput.value = selectedSize;
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const categoryTitles = document.querySelectorAll('.carousel__category-title');

  categoryTitles.forEach(title => {
    title.addEventListener('click', function() {
      // Remove active class from all titles
      categoryTitles.forEach(t => {
        t.classList.remove('active');
      });

      // Add active class to clicked title
      this.classList.add('active');
    });
  });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function toggleMobileMenu() {
  mobileMenuBtn.classList.toggle('active');
  mobileNav.classList.toggle('active');
  mobileNavOverlay.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileNavClose.addEventListener('click', toggleMobileMenu);
mobileNavOverlay.addEventListener('click', toggleMobileMenu);
});

// ========== AUTH LOGIC START ==========

const USER_STORAGE_KEY = 'loggedInUserEmail';

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(USER_STORAGE_KEY) !== null;
}

// Function to get logged in user email
function getLoggedInUserEmail() {
    return localStorage.getItem(USER_STORAGE_KEY);
}

// Function to handle login
function loginUser(email) {
    localStorage.setItem(USER_STORAGE_KEY, email);
    // Redirect to account page after successful login
    window.location.href = '/pages/account.html'; 
}

// Function to handle logout
function logoutUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
    // Redirect to login page or home page after logout
    window.location.href = '/pages/login.html'; 
}

// --- Event Listeners and Page-Specific Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // Update Account Link/Icon Behavior
    const accountLinks = document.querySelectorAll('a[href*="account.html"], button[aria-label="Account"]'); // Adjust selector as needed
    accountLinks.forEach(link => {
        // Prevent default if it's a button or if we want JS to handle all clicks
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Stop default navigation
            if (isLoggedIn()) {
                window.location.href = '/pages/account.html';
            } else {
                window.location.href = '/pages/login.html';
            }
        });
    });

    // --- Login Page Specific Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = document.getElementById('login-email');
            // **Simple Login Simulation:**
            // In a real app, you would send credentials to a server for validation.
            // Here, we'll just check if email/password fields are not empty.
            const passwordInput = document.getElementById('login-password');
            if (emailInput.value && passwordInput.value) {
                 loginUser(emailInput.value);
            } else {
                alert('Please enter both email and password.'); // Basic feedback
            }
        });

        const createAccountBtnLogin = document.getElementById('create-account-btn'); // Button on Login page
        if(createAccountBtnLogin){
            createAccountBtnLogin.addEventListener('click', () => {
                // Redirect to the actual registration page
                window.location.href = '/pages/register.html'; 
            });
        }
    }

    // --- Register Page Specific Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const firstNameInput = document.getElementById('register-first-name');
            const lastNameInput = document.getElementById('register-last-name');

            // **Simple Registration Simulation:**
            // In a real app, you would validate input, send data to a server,
            // handle errors (e.g., email already exists), and potentially log the user in.
            // Here, we just check if fields are filled and simulate success.
            if (emailInput.value && passwordInput.value && firstNameInput.value && lastNameInput.value) {
                // Optional: Store more user info, but for consistency with login, we only store email
                // localStorage.setItem('userFirstName', firstNameInput.value);
                // localStorage.setItem('userLastName', lastNameInput.value);
                
                alert('Account created successfully! Please log in.'); 
                // Redirect to login page after successful registration
                window.location.href = '/pages/login.html';
                
                // Or, log the user in directly (less common for simple examples):
                // loginUser(emailInput.value);

            } else {
                alert('Please fill in all required fields.'); // Basic feedback
            }
        });

        const goToLoginBtn = document.getElementById('go-to-login-btn');
        if(goToLoginBtn) {
            goToLoginBtn.addEventListener('click', () => {
                window.location.href = '/pages/login.html';
            });
        }
    }

    // --- Account Page Specific Logic ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        // Check if user should be on this page
        if (!isLoggedIn()) {
            window.location.href = '/pages/login.html'; // Redirect if not logged in
        } else {
             // Display user info (e.g., email)
            const userEmailSpan = document.getElementById('account-email');
            if(userEmailSpan) {
                userEmailSpan.textContent = getLoggedInUserEmail();
            }
            // Add logout functionality
            logoutBtn.addEventListener('click', logoutUser);
        }
    }

    // Remove old login modal logic if it exists (Find relevant selectors/listeners)
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        // Example: If modal was triggered by a button with specific class/id
        const openLoginModalBtn = document.querySelector('.open-login-modal-button'); // ** ADJUST SELECTOR **
        if(openLoginModalBtn) {
            // Remove or modify the old event listener
            // This might require finding the exact previous code or using removeEventListener if possible
            console.warn("Old login modal trigger might still exist. Please remove its event listener.")
        }
        loginModal.remove(); // Remove the modal HTML itself
    }

});

// ========== AUTH LOGIC END ==========





