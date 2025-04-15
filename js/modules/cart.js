// cart.js

export function initCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const quantityInput = document.getElementById('quantity');
    const quantityUp = document.querySelector('.quantity-up');
    const quantityDown = document.querySelector('.quantity-down');
    const removeBtn = document.querySelector('.remove-btn');
    const cartCountElement = document.querySelector('.cart-count');
    let cartItemCount = parseInt(cartCountElement.textContent) || 0;
  
    let overlay = document.querySelector('.cart-overlay') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'cart-overlay' }));
  
    const openCart = () => {
      cartSidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  
    const closeCart = () => {
      cartSidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  
    const updateCartCount = (count) => {
      cartItemCount = count;
      cartCountElement.textContent = cartItemCount;
      const itemsCount = document.querySelector('.items-count');
      if (itemsCount) itemsCount.textContent = `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`;
    };
  
    const addToCart = () => {
      updateCartCount(cartItemCount + 1);
      openCart();
    };
  
    cartBtn?.addEventListener('click', e => { e.preventDefault(); openCart(); });
    closeCartBtn?.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
  
    quantityUp?.addEventListener('click', () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateCart();
    });
  
    quantityDown?.addEventListener('click', () => {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateCart();
      }
    });
  
    quantityInput?.addEventListener('change', updateCart);
  
    removeBtn?.addEventListener('click', () => {
      updateCartCount(Math.max(0, cartItemCount - 1));
      if (cartItemCount === 0) closeCart();
    });
  
    const updateCart = () => {
      const quantity = parseInt(quantityInput.value);
      const unitPrice = 209.00;
      const total = quantity * unitPrice;
      document.querySelectorAll('.item-price, .summary-row .price').forEach(el => {
        el.textContent = `$${total.toFixed(2)}`;
      });
    };
  
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && cartSidebar.classList.contains('active')) closeCart();
    });
  
    document.querySelectorAll('.add-to-cart')?.forEach(button => {
      button.addEventListener('click', addToCart);
    });
  } 
  