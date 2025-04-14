import { setupPageLoader, handlePageLoad } from './modules/loader.js';
import { setupNavigation } from './modules/navigation.js';
import { setupProductFeatures, setupPurchaseNotification, setupPagination } from './modules/products.js';
import { setupHeroSlider } from './modules/slider.js';

import { setupSearch, submitSearch } from './modules/search.js';
import { setupLoginModal, setupCustomerService } from './modules/modals.js';
import { setupHelp } from './modules/ui.js';
import { setupRecentlyViewed, setupScrollTop, setupScrollingTopBar } from './modules/ui.js';
// Main initialization function

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  setupPageLoader();
  setupNavigation();
  setupProductFeatures();
  setupPurchaseNotification();
  setupPagination();

  setupScrollingTopBar();
  setupHeroSlider();
  setupSearch();
  submitSearch();

  setupLoginModal();
  setupHelp();
  setupRecentlyViewed();
  setupScrollTop();
  setupCustomerService();
  
  console.log('[Debug] Initialization complete');
});

// Handle page load
window.addEventListener('load', handlePageLoad);



// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const cartBtn = document.querySelector('.cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.querySelector('.close-cart');
  const quantityInput = document.getElementById('quantity');
  const quantityUp = document.querySelector('.quantity-up');
  const quantityDown = document.querySelector('.quantity-down');
  const removeBtn = document.querySelector('.remove-btn');
  const cartCountElement = document.querySelector('.cart-count');
  
  // State variables
  let cartItemCount = parseInt(cartCountElement.textContent) || 0;
  
  // Create overlay
  let overlay = document.querySelector('.cart-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    document.body.appendChild(overlay);
  }
  
  // Open cart function
  function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close cart function
  function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Update cart count
  function updateCartCount(count) {
    cartItemCount = count;
    cartCountElement.textContent = cartItemCount;
    
    // Update items count in cart header
    const itemsCount = document.querySelector('.items-count');
    if (itemsCount) {
      itemsCount.textContent = `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`;
    }
  }
  
  // Add to cart function - call this when the user adds an item
  function addToCart() {
    updateCartCount(cartItemCount + 1);
    openCart();
  }
  
  // Cart button click
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openCart();
    });
  }
  
  // Close button click
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  // Overlay click
  overlay.addEventListener('click', closeCart);
  
  // Quantity controls
  if (quantityUp) {
    quantityUp.addEventListener('click', function() {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateCart();
    });
  }
  
  if (quantityDown) {
    quantityDown.addEventListener('click', function() {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateCart();
      }
    });
  }
  
  if (quantityInput) {
    quantityInput.addEventListener('change', updateCart);
  }
  
  // Remove item
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      updateCartCount(Math.max(0, cartItemCount - 1));
      
      // If cart is empty, close it
      if (cartItemCount === 0) {
        closeCart();
      }
    });
  }
  
  // Update cart totals
  function updateCart() {
    const quantity = parseInt(quantityInput.value);
    const unitPrice = 209.00;
    const total = quantity * unitPrice;
    
    document.querySelectorAll('.item-price, .summary-row .price').forEach(el => {
      el.textContent = '$' + total.toFixed(2);
    });
  }
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
      closeCart();
    }
  });
  
  // Example: Add a demo "Add to Cart" button for testing
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  if (addToCartButtons.length) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', addToCart);
    });
  }
});


// Mobile menu toggle functionality could be added here
// For example:
// const mobileMenuButton = document.querySelector('.mobile-menu-button');
// const nav = document.querySelector('.nav');
// 
// mobileMenuButton.addEventListener('click', () => {
//   nav.classList.toggle('nav--open');
// });

// You could add image lazy loading here
document.addEventListener('DOMContentLoaded', () => {
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

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Filter toggle functionality
  const filterToggles = document.querySelectorAll('.filter__toggle');
  
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const filterContent = this.closest('.filter').querySelector('.filter__content');
      const minusIcon = this.querySelector('.minus');
      
      if (filterContent.style.display === 'none') {
        filterContent.style.display = 'block';
        minusIcon.textContent = '−';
      } else {
        filterContent.style.display = 'none';
        minusIcon.textContent = '+';
      }
    });
  });
  
  // View options functionality
  const viewButtons = document.querySelectorAll('.view-btn');
  const productsGrid = document.querySelector('.products__grid');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      viewButtons.forEach(btn => btn.classList.remove('view-btn--active'));
      
      // Add active class to clicked button
      this.classList.add('view-btn--active');
      
      // Change grid layout based on selected view
      const icon = this.querySelector('i').className;
      
      if (icon.includes('sunny2')) {
        productsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else if (icon.includes('sunny3')) {
        productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      } else if (icon.includes('sunny4')) {
        productsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      } else if (icon.includes('sunnyflex')) {
        productsGrid.style.gridTemplateColumns = '1fr';
      }
    });
  });
  
  // Price slider functionality
  const priceSlider = document.querySelector('.price-slider');
  const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
  const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
  const range = document.querySelector('.price-slider__range');
  const minPrice = document.querySelector('.price-min');
  const maxPrice = document.querySelector('.price-max');
  
  let isDragging = false;
  let currentThumb = null;
  let startX = 0;
  let startLeft = 0;
  
  const minValue = 0;
  const maxValue = 200;
  let currentMinValue = minValue;
  let currentMaxValue = maxValue;
  
  function updatePriceRange() {
    const track = priceSlider.querySelector('.price-slider__track');
    const trackWidth = track.offsetWidth;
    
    const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
    const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
    
    minThumb.style.left = `${minPercent}%`;
    maxThumb.style.left = `${maxPercent}%`;
    
    range.style.left = `${minPercent}%`;
    range.style.right = `${100 - maxPercent}%`;
    
    minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
    maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
  }
  
  function startDrag(e, thumb) {
    e.preventDefault();
    isDragging = true;
    currentThumb = thumb;
    
    startX = e.clientX || e.touches[0].clientX;
    startLeft = parseFloat(currentThumb.style.left) || 
                (currentThumb.dataset.value === 'min' ? 0 : 100);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    const track = priceSlider.querySelector('.price-slider__track');
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const deltaX = clientX - startX;
    const deltaPercent = (deltaX / trackWidth) * 100;
    let newLeft = startLeft + deltaPercent;
    
    // Constrain to track bounds
    newLeft = Math.max(0, Math.min(100, newLeft));
    
    // Prevent thumbs from crossing
    if (currentThumb.dataset.value === 'min') {
      const maxLeft = parseFloat(maxThumb.style.left) || 100;
      newLeft = Math.min(newLeft, maxLeft - 5);
      currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
    } else {
      const minLeft = parseFloat(minThumb.style.left) || 0;
      newLeft = Math.max(newLeft, minLeft + 5);
      currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
    }
    
    currentThumb.style.left = `${newLeft}%`;
    updatePriceRange();
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
  
  minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
  minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
  maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
  maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
  
  // Initialize price slider
  updatePriceRange();
  
  // Product hover effects
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const img = this.querySelector('.product-card__image img');
      img.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
      const img = this.querySelector('.product-card__image img');
      img.style.transform = 'scale(1)';
    });
  });
  
  // Pagination functionality
  const paginationButtons = document.querySelectorAll('.pagination__btn:not(.pagination__btn--prev):not(.pagination__btn--next)');
  
  paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
      paginationButtons.forEach(btn => btn.classList.remove('pagination__btn--active'));
      this.classList.add('pagination__btn--active');
      
      // Here you would typically fetch new products based on the page
      console.log(`Navigating to page ${this.textContent}`);
    });
  });
});

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
  // Filter toggle functionality
  const filterToggles = document.querySelectorAll('.filter__toggle');
  
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const filterContent = this.closest('.filter').querySelector('.filter__content');
      const minusIcon = this.querySelector('.minus');
      
      if (filterContent.style.display === 'none') {
        filterContent.style.display = 'block';
        minusIcon.textContent = '−';
      } else {
        filterContent.style.display = 'none';
        minusIcon.textContent = '+';
      }
    });
  });

  // Price slider functionality
  const priceSlider = document.querySelector('.price-slider');
  if (priceSlider) {
    const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
    const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
    const range = document.querySelector('.price-slider__range');
    const minPrice = document.querySelector('.price-min');
    const maxPrice = document.querySelector('.price-max');
    
    let isDragging = false;
    let currentThumb = null;
    let startX = 0;
    let startLeft = 0;
    
    const minValue = 0;
    const maxValue = 200;
    let currentMinValue = minValue;
    let currentMaxValue = maxValue;
    
    function updatePriceRange() {
      const track = priceSlider.querySelector('.price-slider__track');
      const trackWidth = track.offsetWidth;
      
      const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
      const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
      
      minThumb.style.left = `${minPercent}%`;
      maxThumb.style.left = `${maxPercent}%`;
      
      range.style.left = `${minPercent}%`;
      range.style.right = `${100 - maxPercent}%`;
      
      minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
      maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
    }
    
    function startDrag(e, thumb) {
      e.preventDefault();
      isDragging = true;
      currentThumb = thumb;
      
      startX = e.clientX || e.touches[0].clientX;
      startLeft = parseFloat(currentThumb.style.left) || 
                  (currentThumb.dataset.value === 'min' ? 0 : 100);
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      const track = priceSlider.querySelector('.price-slider__track');
      const trackRect = track.getBoundingClientRect();
      const trackWidth = trackRect.width;
      
      const clientX = e.clientX || e.touches[0].clientX;
      const deltaX = clientX - startX;
      const deltaPercent = (deltaX / trackWidth) * 100;
      let newLeft = startLeft + deltaPercent;
      
      // Constrain to track bounds
      newLeft = Math.max(0, Math.min(100, newLeft));
      
      // Prevent thumbs from crossing
      if (currentThumb.dataset.value === 'min') {
        const maxLeft = parseFloat(maxThumb.style.left) || 100;
        newLeft = Math.min(newLeft, maxLeft - 5);
        currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
      } else {
        const minLeft = parseFloat(minThumb.style.left) || 0;
        newLeft = Math.max(newLeft, minLeft + 5);
        currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
      }
      
      currentThumb.style.left = `${newLeft}%`;
      updatePriceRange();
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
    
    minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
    minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
    maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
    maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
    
    // Initialize price slider
    updatePriceRange();
  }

  // Color filter selection
  const colorFilters = document.querySelectorAll('.color-filter');
  colorFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
    });
  });

  // Size filter selection
  const sizeFilters = document.querySelectorAll('.size-filter');
  sizeFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
    });
  });
});