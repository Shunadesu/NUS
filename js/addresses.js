document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editModal = document.getElementById('editAddressModal');
    const deleteModal = document.getElementById('deleteAddressModal');
    const addressesContainer = document.querySelector('.default-addresses');
    const addressTemplate = document.getElementById('addressCardTemplate');
    const form = document.getElementById('editAddressForm');
    let currentAddressId = null;

    // Initialize addresses in localStorage if not exists
    if (!localStorage.getItem('addresses')) {
        localStorage.setItem('addresses', JSON.stringify([{
            id: 'default',
            firstName: 'Pham',
            lastName: 'Nam',
            company: '',
            address1: '123 Main St',
            address2: '',
            city: 'New York',
            country: 'US',
            postal: '10001',
            phone: '123-456-7890',
            isDefault: true
        }]));
    }

    // Render addresses from localStorage
    function renderAddresses() {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const container = document.querySelector('.default-addresses');
        container.innerHTML = '<h3>Default addresses</h3>';
        
        addresses.forEach(address => {
            const card = addressTemplate.content.cloneNode(true);
            const cardElement = card.querySelector('.address-card');
            
            cardElement.dataset.addressId = address.id;
            cardElement.querySelector('.name').textContent = `${address.firstName} ${address.lastName}`;
            if (address.company) {
                cardElement.querySelector('.company').textContent = address.company;
            } else {
                cardElement.querySelector('.company').remove();
            }
            cardElement.querySelector('.address1').textContent = address.address1;
            if (address.address2) {
                cardElement.querySelector('.address2').textContent = address.address2;
            } else {
                cardElement.querySelector('.address2').remove();
            }
            cardElement.querySelector('.city-state').textContent = `${address.city}, ${address.postal}`;
            cardElement.querySelector('.country').textContent = address.country === 'US' ? 'United States' : address.country;
            cardElement.querySelector('.phone').textContent = address.phone;

            // Add event listeners to buttons
            cardElement.querySelector('.edit-btn').addEventListener('click', () => openEditModal(address.id));
            cardElement.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(address.id));

            container.appendChild(cardElement);
        });

        // Update address count in header
        const countElement = document.querySelector('.addresses-header h2');
        if (countElement) {
            countElement.textContent = `Your addresses (${addresses.length})`;
        }
    }

    // Handle Add New Address button
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => openEditModal());
    }

    // Open edit modal
    function openEditModal(addressId = null) {
        currentAddressId = addressId;
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const address = addressId ? addresses.find(a => a.id === addressId) : null;

        // Update modal title
        const titleElement = editModal.querySelector('.edit-title');
        titleElement.textContent = address ? `${address.firstName} ${address.lastName} Default addresses` : 'New Address';

        // Fill form if editing
        if (address) {
            Object.keys(address).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = address[key];
                    } else {
                        input.value = address[key];
                    }
                }
            });
        } else {
            form.reset();
            document.getElementById('addressId').value = 'address_' + Date.now();
        }

        editModal.classList.add('show');
    }

    // Open delete modal
    function openDeleteModal(addressId) {
        currentAddressId = addressId;
        deleteModal.classList.add('show');
    }

    // Close modals
    function closeModal(modalElement) {
        modalElement.classList.remove('show');
        currentAddressId = null;
    }

    // Handle modal close buttons
    document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalType = btn.dataset.modal;
            const modal = modalType === 'delete' ? deleteModal : editModal;
            closeModal(modal);
        });
    });

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.isDefault = formData.get('defaultAddress') === 'on';

            // Get existing addresses
            let addresses = JSON.parse(localStorage.getItem('addresses')) || [];

            if (currentAddressId) {
                // Update existing address
                addresses = addresses.map(addr => 
                    addr.id === currentAddressId ? {...data, id: currentAddressId} : addr
                );
            } else {
                // Add new address
                addresses.push({...data, id: data.addressId});
            }

            // Save to localStorage
            localStorage.setItem('addresses', JSON.stringify(addresses));
            
            // Refresh the display
            renderAddresses();
            closeModal(editModal);
        });
    }

    // Handle delete confirmation
    const deleteConfirmBtn = deleteModal.querySelector('.delete-confirm-btn');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', function() {
            if (currentAddressId) {
                let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                addresses = addresses.filter(addr => addr.id !== currentAddressId);
                localStorage.setItem('addresses', JSON.stringify(addresses));
                renderAddresses();
                closeModal(deleteModal);
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeModal(editModal);
        } else if (event.target === deleteModal) {
            closeModal(deleteModal);
        }
    });

    // Initial render
    renderAddresses();
}); 