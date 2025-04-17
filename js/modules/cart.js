
// Import notification utility
import { showNotification } from './notification.js';

// Initialize all cart functionality
export function initCart() {
  // Initialize the cart sidebar
  initCartSidebar();
  
  // Initialize add to cart button (product detail page)
  initAddToCart();
  
  // Initialize wishlist button
  initWishlist();
  
  // Initialize compare button
  initCompare();
}

// Cart sidebar functionality
function initCartSidebar() {
  const cartBtn = document.querySelector('.cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartCountElement = document.querySelector('.cart-count');
  
  if (!cartSidebar || !cartCountElement) return;
  
  let cartItemCount = parseInt(cartCountElement.textContent) || 0;
  
  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.cart-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    document.body.appendChild(overlay);
  }
  
  // Open cart function
  const openCart = () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  // Close cart function
  const closeCart = () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  // Update cart count
  const updateCartCount = (count) => {
    cartItemCount = count;
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cartItemCount;
    });
    
    const itemsCount = document.querySelector('.items-count');
    if (itemsCount) {
      itemsCount.textContent = `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`;
    }
  };
  
  // Cart button click handler
  if (cartBtn) {
    cartBtn.addEventListener('click', e => { 
      e.preventDefault(); 
      openCart(); 
    });
  }
  
  // Close cart button click handler
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  // Overlay click handler
  overlay.addEventListener('click', closeCart);
  
  // Escape key handler
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
      closeCart();
    }
  });
  
  // Initialize quantity controls in cart
  initCartQuantityControls(updateCartCount, closeCart);
  
  // Add to Cart buttons across the site
  document.querySelectorAll('.add-to-cart').forEach(button => {
    if (button) {
      button.addEventListener('click', () => {
        updateCartCount(cartItemCount + 1);
        openCart();
        showNotification("Product added to cart successfully!");
      });
    }
  });
  
  // Export functions for use in other contexts
  window.cartFunctions = {
    openCart,
    closeCart,
    updateCartCount
  };
}

// Cart quantity controls
function initCartQuantityControls(updateCartCount, closeCart) {
  const quantityInput = document.getElementById('quantity');
  const quantityUp = document.querySelector('.quantity-up');
  const quantityDown = document.querySelector('.quantity-down');
  const removeBtn = document.querySelector('.remove-btn');
  const cartCountElement = document.querySelector('.cart-count');
  
  if (!quantityInput) return;
  
  let cartItemCount = parseInt(cartCountElement?.textContent) || 0;
  
  // Quantity up button
  if (quantityUp) {
    quantityUp.addEventListener('click', () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateCartTotals();
    });
  }
  
  // Quantity down button
  if (quantityDown) {
    quantityDown.addEventListener('click', () => {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateCartTotals();
      }
    });
  }
  
  // Quantity input change
  if (quantityInput) {
    quantityInput.addEventListener('change', updateCartTotals);
  }
  
  // Remove button
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      cartItemCount = Math.max(0, cartItemCount - 1);
      updateCartCount(cartItemCount);
      if (cartItemCount === 0) closeCart();
    });
  }
  
  // Update cart totals
  const updateCartTotals = () => {
    if (!quantityInput) return;
    
    const quantity = parseInt(quantityInput.value);
    const unitPrice = 209.00; // This should be dynamic in a real application
    const total = quantity * unitPrice;
    
    document.querySelectorAll('.item-price, .summary-row .price').forEach(el => {
      el.textContent = `$${total.toFixed(2)}`;
    });
  };
}

// Add to cart functionality (for product detail page)
function initAddToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (!addToCartBtn) return;

  addToCartBtn.addEventListener("click", () => {
    // Get selected options
    const selectedColor = document.querySelector(".color-option.selected");
    const quantityInput = document.querySelector(".quantity-input");
    const customNote = document.getElementById("customNote");
    
    if (!selectedColor || !quantityInput) return;
    
    const colorName = selectedColor.getAttribute("data-color");
    const quantity = Number.parseInt(quantityInput.value);
    const note = customNote ? customNote.value : "";
    const mainImage = document.getElementById("mainImage");
    const productName = document.querySelector(".product-title")?.textContent || "Product";
    const productPrice = parseFloat(document.querySelector(".product-price")?.dataset?.price || 116.0);

    // Create cart item object
    const cartItem = {
      name: productName,
      color: colorName,
      quantity: quantity,
      price: productPrice,
      customNote: note,
      image: mainImage ? mainImage.src : "",
    };

    // Log the cart item (for demo purposes)
    console.log("Added to cart:", cartItem);

    // Update cart count using shared function if available
    if (window.cartFunctions?.updateCartCount) {
      const cartCountElement = document.querySelector('.cart-count');
      const currentCount = parseInt(cartCountElement?.textContent) || 0;
      window.cartFunctions.updateCartCount(currentCount + quantity);
      window.cartFunctions.openCart();
    } else {
      // Fallback if cart sidebar not initialized
      const cartCount = document.querySelector(".cart-count");
      if (cartCount) {
        const currentCount = Number.parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + quantity;
      }
    }

    // Show confirmation message
    showNotification("Product added to cart successfully!");
  });
}

// Wishlist functionality
function initWishlist() {
  const wishlistBtn = document.querySelector(".wishlist-btn");
  if (!wishlistBtn) return;

  wishlistBtn.addEventListener("click", function () {
    this.classList.toggle("active");

    if (this.classList.contains("active")) {
      this.innerHTML = '<i class="fas fa-heart"></i>';
      showNotification("Product added to wishlist!");
    } else {
      this.innerHTML = '<i class="far fa-heart"></i>';
      showNotification("Product removed from wishlist!");
    }
  });
}

// Compare functionality
function initCompare() {
  const compareBtn = document.querySelector(".compare-btn");
  if (!compareBtn) return;

  compareBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    showNotification("Product added to compare list!");
  });
}