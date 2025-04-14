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