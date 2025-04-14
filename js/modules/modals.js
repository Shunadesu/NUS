// Customer service modal
export function setupCustomerService() {
    const modal = document.getElementById('customerServiceModal');
    if (!modal) return;
    
    const openButton = document.getElementById('openCustomerService');
    const closeButton = document.getElementById('closeModal');
    
    function openModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    if (openButton) openButton.addEventListener('click', openModal);
    if (closeButton) closeButton.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(event) {
      if (event.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
    
    const links = modal.querySelectorAll('.modal-content a');
    links.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Link clicked:', this.textContent);
      });
    });
    
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
    
    accountBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.classList.add('active');
    });
    
    if (closeModal) {
      closeModal.addEventListener('click', closeLoginModal);
    }
    
    window.addEventListener('click', function(event) {
      if (event.target === loginModal) {
        closeLoginModal();
      }
    });
    
    function closeLoginModal() {
      if (loginForm) {
        loginForm.style.animation = 'slideOutRight 0.3s ease forwards';
        
        setTimeout(() => {
          loginModal.classList.remove('active');
          loginForm.style.animation = '';
        }, 300);
      } else {
        loginModal.classList.remove('active');
      }
    }
  }