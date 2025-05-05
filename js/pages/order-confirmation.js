document.addEventListener('DOMContentLoaded', function() {
    // Generate a random order number
    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('orderNumber').textContent = orderNumber;

    // Set current date
    const now = new Date();
    document.getElementById('orderDate').textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {};
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Set payment method
    document.getElementById('paymentMethod').textContent = orderData.paymentMethod || 'Credit Card';

    // Set shipping address
    const address = [
        orderData.fullName,
        orderData.address,
        orderData.city
    ].filter(Boolean).join(', ');
    document.getElementById('shippingAddress').textContent = address || 'N/A';

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10; // Fixed shipping cost
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    // Display totals
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);

    // Display order items
    const orderItemsContainer = document.getElementById('orderItems');
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
            </div>
            <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Clear cart and order data from localStorage
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');
});

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add styles for order items
const style = document.createElement('style');
style.textContent = `
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
    }

    .order-item:last-child {
        border-bottom: none;
    }

    .item-details {
        display: flex;
        gap: 0.5rem;
    }

    .item-name {
        color: #333;
        font-weight: 500;
    }

    .item-quantity {
        color: #666;
    }

    .item-price {
        font-weight: 600;
        color: #333;
    }
`;
document.head.appendChild(style); 