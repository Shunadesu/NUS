import { showNotification } from '../modules/notification.js';

// Cart storage functionality
function addToCart(product) {
  // Get existing cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex(item => item && item.id && product && product.id && item.id === product.id);

  if (existingProductIndex > -1) {
    // Update quantity if product exists
    cart[existingProductIndex].qty += product.qty;
  } else {
    // Add new product to cart
    cart.push(product);
  }

  // Save updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart count in UI
  updateCartCount();

  // Show confirmation
  if (product) {
    showNotification("Product added to cart successfully!");
  }
  
  // Add animation to cart icon
  const cartIcon = document.querySelector('.cart-btn');
  if (cartIcon) {
    cartIcon.classList.add('cart-bounce');
    setTimeout(() => {
      cartIcon.classList.remove('cart-bounce');
    }, 1000);
  }
}

// Get cart total quantity
function getCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((total, item) => total + (item?.qty || 0), 0);
}

// Update cart count in UI
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = getCartCount();
  }
}

// Initialize cart functionality
function initCartStorage() {
  // Update initial cart count
  updateCartCount();

  // Add click handler for add to cart buttons
  document.addEventListener('click', function(e) {
    if (e.target.matches('.add-to-cart-button')) {
      e.preventDefault();
      const btn = e.target;
      
      // Add loading state
      btn.classList.add('loading');
      btn.disabled = true;
      
      const productCard = btn.closest('.product-card');
      if (!productCard) return;

      try {
        const product = {
          id: productCard.dataset.productId || Math.random().toString(36).substr(2, 9),
          name: productCard.querySelector('.product-card__title').textContent,
          variant: 'Default',
          price: parseFloat(productCard.querySelector('.price-sale').textContent.replace('$', '')),
          qty: 1,
          img: productCard.querySelector('.primary-image').src
        };

        addToCart(product);
      } catch (err) {
        console.error('Error adding product to cart:', err);
        showNotification('Error adding product to cart', 'error');
      }
      
      // Remove loading state after delay
      setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
      }, 500);
    }
  });
}

// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
  const cartItemsEl = document.getElementById('cartItems');
  if (!cartItemsEl) return; // Not on cart page

  // Check login
  const user = localStorage.getItem('loggedInUserEmail');
  if (!user) {
    window.location.href = '/pages/login.html';
    return;
  }

  const subtotalEl = document.querySelector('.cart-subtotal-value');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartItemsEl.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, idx) => {
      if (!item || typeof item.price !== 'number' || typeof item.qty !== 'number') {
        return;
      }

      subtotal += item.price * item.qty;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="cart-product-info">
          <a href="/pages/product-detail.html">
            <img src="${item.img}" alt="${item.name}" class="cart-product-img">
            <div>
              <div class="cart-product-title">${item.name}</div>
              <div class="cart-product-variant">${item.variant}</div>
              <div class="cart-product-price">$${item.price.toFixed(2)}</div>
            </div>
          </a>
        </td>
        <td class="cart-qty">
          <div class="cart-qty-control">
            <button class="cart-qty-btn" data-action="decrease" data-idx="${idx}">-</button>
            <span class="cart-qty-value">${item.qty}</span>
            <button class="cart-qty-btn" data-action="increase" data-idx="${idx}">+</button>
            <button class="cart-qty-btn" data-action="remove" data-idx="${idx}" title="Remove">🗑️</button>
          </div>
        </td>
        <td class="cart-total">$${(item.price * item.qty).toFixed(2)}</td>
      `;
      cartItemsEl.appendChild(tr);
    });

    // Filter out invalid items
    cart = cart.filter(item => item && typeof item.price === 'number' && typeof item.qty === 'number');
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  cartItemsEl.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-qty-btn')) {
      const idx = +e.target.dataset.idx;
      const action = e.target.dataset.action;
      
      if (idx >= 0 && idx < cart.length) {
        if (action === 'increase') cart[idx].qty++;
        if (action === 'decrease' && cart[idx].qty > 1) cart[idx].qty--;
        if (action === 'remove') cart.splice(idx, 1);
        
        renderCart();
      }
    }
  });

  renderCart();
});

// Initialize cart storage
export { initCartStorage, addToCart, getCartCount, updateCartCount };
