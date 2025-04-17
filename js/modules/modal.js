// modal.js - Handles all modal windows functionality

// Initialize all modal functionality
export function initModals() {
  // Image zoom modal
  initImageZoomModal();
  
  // Customer service modal
  setupCustomerService();
  
  // Login modal
  setupLoginModal();
}

// Image zoom modal functionality
function initImageZoomModal() {
  const zoomBtn = document.getElementById("zoomBtn");
  const imageModal = document.getElementById("imageModal");
  const closeModal = document.querySelector(".close-modal");
  
  if (!imageModal) return;

  // Open modal with zoom button
  if (zoomBtn) {
    zoomBtn.addEventListener("click", () => {
      showModal(imageModal);
    });
  }

  // Close modal with close button
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      hideModal(imageModal);
    });
  }

  // Close modal when clicking outside the image
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      hideModal(imageModal);
    }
  });
}

// Customer service modal functionality
export function setupCustomerService() {
  const modal = document.getElementById('customerServiceModal');
  if (!modal) return;
  
  const openButton = document.getElementById('openCustomerService');
  const closeButton = document.getElementById('closeModal');
  
  // Open modal
  if (openButton) {
    openButton.addEventListener('click', () => {
      showModal(modal, true);
    });
  }
  
  // Close with button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      hideModal(modal, true);
    });
  }
  
  // Close when clicking outside content
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      hideModal(modal, true);
    }
  });
  
  // Handle links inside modal
  const links = modal.querySelectorAll('.modal-content a');
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Link clicked:', this.textContent);
    });
  });
  
  // Handle send message link
  const sendMessageLink = modal.querySelector('.send-message');
  if (sendMessageLink) {
    sendMessageLink.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Opening message form...');
      alert('Message form would open here');
    });
  }
}

// Login modal functionality
export function setupLoginModal() {
  const accountBtn = document.querySelector('.icon-btn[aria-label="Account"]');
  const loginModal = document.getElementById('login-modal');
  
  if (!accountBtn || !loginModal) return;
  
  const loginForm = loginModal.querySelector('.login-form');
  const closeModal = loginModal.querySelector('.close-modal');
  
  // Open modal
  accountBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showModal(loginModal, true);
  });
  
  // Close with button
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      closeLoginModal(loginModal, loginForm);
    });
  }
  
  // Close when clicking outside content
  window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
      closeLoginModal(loginModal, loginForm);
    }
  });
}

// Special close function for login modal with animation
function closeLoginModal(modal, form) {
  if (form) {
    form.style.animation = 'slideOutRight 0.3s ease forwards';
    
    setTimeout(() => {
      hideModal(modal, true);
      form.style.animation = '';
    }, 300);
  } else {
    hideModal(modal, true);
  }
}

// Reusable function to show modals
function showModal(modal, useClass = false) {
  if (!modal) return;
  
  if (useClass) {
    modal.classList.add('active');
  } else {
    modal.style.display = 'block';
  }
  
  // Prevent scrolling
  document.body.style.overflow = 'hidden';
  
  // Add global ESC key handler if not already added
  addEscapeKeyHandler();
}

// Reusable function to hide modals
function hideModal(modal, useClass = false) {
  if (!modal) return;
  
  if (useClass) {
    modal.classList.remove('active');
  } else {
    modal.style.display = 'none';
  }
  
  // Restore scrolling
  document.body.style.overflow = '';
}

// Global ESC key handler for all modals
let escHandlerAdded = false;
function addEscapeKeyHandler() {
  if (escHandlerAdded) return;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close image zoom modal
      const imageModal = document.getElementById('imageModal');
      if (imageModal && (imageModal.style.display === 'block')) {
        hideModal(imageModal);
      }
      
      // Close customer service modal
      const customerModal = document.getElementById('customerServiceModal');
      if (customerModal && customerModal.classList.contains('active')) {
        hideModal(customerModal, true);
      }
      
      // Close login modal
      const loginModal = document.getElementById('login-modal');
      if (loginModal && loginModal.classList.contains('active')) {
        const loginForm = loginModal.querySelector('.login-form');
        closeLoginModal(loginModal, loginForm);
      }
    }
  });
  
  escHandlerAdded = true;
}