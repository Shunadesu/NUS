import { setupPageLoader, handlePageLoad } from './modules/loader.js';
import { setupNavigation } from './modules/navigation.js';
import { setupHeroSlider } from './modules/slider.js';
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




