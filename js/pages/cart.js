// cart.js - Cart page logic with login check

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsEl = document.getElementById('cartItems');
  if (!cartItemsEl) return; // Not on cart page

  // Check login
  // const user = localStorage.getItem('loggedInUserEmail');
  // if (!user) {
  //   window.location.href = '/pages/login.html';
  //   return;
  // }

  const subtotalEl = document.querySelector('.cart-subtotal-value');
  const emptyCartMessage = document.querySelector('.cart-empty-message');
  let cart = JSON.parse(localStorage.getItem('cart'))?.filter(Boolean) || [];

  const updateSubtotal = (subtotal = 0) => {
    if (subtotalEl) {
      subtotalEl.textContent = `${subtotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}`;
    }
  };

  

  const toggleEmptyMessage = (isEmpty) => {
    if (emptyCartMessage) {
      emptyCartMessage.style.display = isEmpty ? 'flex' : 'none';
    }
    if (isEmpty) {
      updateSubtotal(0);
    }
  };

  const createCartItem = (item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cart-product-info">
          <a href="/pages/product-detail.html">
            <img src="${item.img}" alt="${item.name}" class="cart-product-img">  
          </a>
        </td>
        <td class="cart-product-price">${item.price.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})} VNĐ</td>
        <td class="cart-qty">
          <div class="cart-qty-control">
            <button class="cart-qty-btn" data-action="decrease" data-idx="${idx}">-</button>
            <span class="cart-qty-value">${item.qty}</span>
            <button class="cart-qty-btn" data-action="increase" data-idx="${idx}">+</button>

          </div>
        </td>
        <td class="cart-total">${(item.price * item.qty).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})} VNĐ</td> 
        <td class="cart-delete"><button class="cart-qty-btn" data-action="remove" data-idx="${idx}" title="Remove">x</button></td>
    `;
    return tr;
  };

  const renderCart = () => {
    cartItemsEl.innerHTML = '';
    
    if (!cart.length) {
      toggleEmptyMessage(true);
      return;
    }

    toggleEmptyMessage(false);

    
    const subtotal = cart.reduce((total, item) => {
      if (!item?.price || !item?.qty) return total;
      cartItemsEl.appendChild(createCartItem(item, cart.indexOf(item)));
      return total + (item.price * item.qty);
    }, 0);

    updateSubtotal(subtotal);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  const handleQuantityChange = (idx, action) => {
    if (idx < 0 || idx >= cart.length) return;

    switch(action) {
      case 'increase':
        cart[idx].qty++;
        break;
      case 'decrease':
        if (cart[idx].qty > 1) cart[idx].qty--;
        break;
      case 'remove':
        cart.splice(idx, 1);
        break;
    }
    
    renderCart();
  };

  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.classList.contains('cart-qty-btn')) {
      handleQuantityChange(+btn.dataset.idx, btn.dataset.action);
    }
  });

  renderCart();
});