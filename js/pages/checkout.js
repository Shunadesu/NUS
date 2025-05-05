// Check user authentication status
function checkUserAuth() {
    const user = localStorage.getItem('loggedInUserEmail');
    return !!user;
}

// Show membership popup
function showMembershipPopup() {
    const popup = document.createElement('div');
    popup.className = 'membership-popup';
    popup.innerHTML = `
        <div class="membership-popup-content">
            <h3>Become a Member</h3>
            <p>Would you like to become a member to enjoy exclusive benefits?</p>
            <div class="membership-popup-buttons">
                <button class="btn-yes">Yes, I want to join</button>
                <button class="btn-no">No, continue as guest</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    // Add event listeners
    popup.querySelector('.btn-yes').addEventListener('click', () => {
        popup.remove();
        window.location.href = '/pages/login.html';
    });

    popup.querySelector('.btn-no').addEventListener('click', () => {
        popup.remove();
        // Continue as guest
        saveGuestCheckoutData();
        // Redirect to order confirmation page after successful guest checkout
        processCheckout();
    });
}

// Save guest checkout data
function saveGuestCheckoutData() {
    const formData = {
        fullName: document.getElementById('fullName')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        orderNote: document.getElementById('orderNote')?.value || '',
        agreeTerms: document.getElementById('agreeTerms')?.checked || false
    };

    localStorage.setItem('guestCheckoutData', JSON.stringify(formData));
    
}

// Handle checkout form submission
function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    if (!checkUserAuth()) {
        showMembershipPopup();
        return;
    }

    // If user is logged in, proceed with checkout
    const formData = {
        fullName: document.getElementById('fullName')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        orderNote: document.getElementById('orderNote')?.value || '',
        agreeTerms: document.getElementById('agreeTerms')?.checked || false
    };

    // Validate form data
    if (!validateCheckoutForm(formData)) {
        return;
    }

    // Here you would typically send the data to your server
    console.log('Checkout form submitted:', formData);
    processCheckout(formData);
}

// Validate checkout form
function validateCheckoutForm(formData) {
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone || !formData.email) {
        const popup = document.createElement('div');
        popup.className = 'membership-popup';
        const popupContent = document.createElement('div');
        popupContent.className = 'membership-popup-content';
        popupContent.innerHTML = `
            <h3>Form Error</h3>
            <p>Please fill in all required fields.</p>
            <button onclick="this.parentElement.parentElement.remove();" 
                    style="background: #dc3545; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; margin-top: 1rem; cursor: pointer;">
                OK
            </button>
        `;
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        return false;
    }

    if (!formData.agreeTerms) {
        const popup = document.createElement('div');
        popup.className = 'membership-popup';
        const popupContent = document.createElement('div');
        popupContent.className = 'membership-popup-content';
        popupContent.innerHTML = `
            <h3>Form Error</h3>
            <p>Please agree to the Terms & Conditions to proceed.</p>
            <button onclick="this.parentElement.parentElement.remove();" 
                    style="background: #dc3545; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; margin-top: 1rem; cursor: pointer;">
                OK
            </button>
        `;
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
        const popup = document.createElement('div');
        popup.className = 'membership-popup';
        const popupContent = document.createElement('div');
        popupContent.className = 'membership-popup-content';
        popupContent.innerHTML = `
            <h3>Form Error</h3>
            <p>Please enter a valid phone number.</p>
            <button onclick="this.parentElement.parentElement.remove();" 
                    style="background: #dc3545; color: white; border: none; padding: 8px 16px; 
                    border-radius: 4px; margin-top: 1rem; cursor: pointer;">
                OK
            </button>
        `;
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        return false;
    }

    return true;
}

// Process checkout
function processCheckout() {
    // Here you would typically:
    // 1. Send order data to server
    // 2. Process payment
    // 3. Clear cart
    // 4. Show success message
    // 5. Redirect to confirmation page

    // For now, we'll just show a success message
    const popup = document.createElement('div');
    popup.className = 'membership-popup';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'membership-popup-content';
    
    popupContent.innerHTML = `
        <h3>Order Confirmation</h3>
        <p>Order placed successfully! Thank you for your purchase.</p>
        <button onclick="this.parentElement.parentElement.remove(); window.location.href = '/pages/order-confirmation.html';" 
                style="background: #4CAF50; color: white; border: none; padding: 8px 16px; 
                border-radius: 4px; margin-top: 1rem; cursor: pointer;">
            OK
        </button>
    `;
    
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
    
    // Clear cart from localStorage
    localStorage.removeItem('cart');
   
}

// Handle PayPal button click
function handlePayPalClick() {
    if (!checkUserAuth()) {
        showMembershipPopup();
        return;
    }

    // Create and show PayPal popup
    const popup = document.createElement('div');
    popup.className = 'membership-popup';
    
    const popupContent = document.createElement('div'); 
    popupContent.className = 'membership-popup-content';
    
    popupContent.innerHTML = `
        <h3>PayPal Payment</h3>
        <p>PayPal integration is coming soon! We're working hard to bring you secure payment options.</p>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: #4CAF50; color: white; border: none; padding: 8px 16px; 
                border-radius: 4px; margin-top: 1rem; cursor: pointer;">
            Close
        </button>
    `;
    
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for form submission
    const checkoutForm = document.querySelector('.cart-sidebar');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Add event listener for PayPal button
    const paypalBtn = document.querySelector('.paypal-btn');
    if (paypalBtn) {
        paypalBtn.addEventListener('click', handlePayPalClick);
    }

    // Add event listener for checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckoutSubmit);
    }

    // Add styles for membership popup
    const style = document.createElement('style');
    style.textContent = `
        .membership-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .membership-popup-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .membership-popup h3 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            color: #333;
        }

        .membership-popup p {
            margin-bottom: 1.5rem;
            color: #666;
        }

        .membership-popup-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .membership-popup button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-yes {
            background-color: #000;
            color: white;
        }

        .btn-yes:hover {
            background-color: #333;
        }

        .btn-no {
            background-color: #f5f5f5;
            color: #333;
        }

        .btn-no:hover {
            background-color: #e5e5e5;
        }
    `;
    document.head.appendChild(style);

    // Load saved guest data if exists
    const savedGuestData = localStorage.getItem('guestCheckoutData');
    if (savedGuestData) {
        const formData = JSON.parse(savedGuestData);
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = formData[key];
                } else {
                    element.value = formData[key];
                }
            }
        });
    }
}); 