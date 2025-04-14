 // Product features (images, color selection, nav buttons)
export function setupProductFeatures() {
  // Product hover effects
  const productImages = document.querySelectorAll('.product-image img');
  productImages.forEach(img => {
    img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
    img.addEventListener('mouseleave', () => img.style.transform = '');
  });
  
  // Color selection
  const colorOptions = document.querySelectorAll('.color-option');
  const productColorText = document.querySelector('.product-color');
  
  if (colorOptions.length && productColorText) {
    colorOptions.forEach(option => {
      option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const colorName = this.getAttribute('data-color');
        productColorText.textContent = colorName;
      });
    });
  }
  
  // Product navigation
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const detailsButton = document.querySelector('.details-button');
  
  prevButton?.addEventListener('click', () => console.log('Previous product clicked'));
  nextButton?.addEventListener('click', () => console.log('Next product clicked'));
  detailsButton?.addEventListener('click', () => console.log('Details button clicked'));
  
  // Purchase notification
  setupPurchaseNotification();
  
  // Pagination
  setupPagination();
}

// Purchase notification functionality
export function setupPurchaseNotification() {
  const notification = document.getElementById('purchase-notification');
  const closeBtn = document.getElementById('notification-close');
  
  if (!notification || !closeBtn) return;
  
  let notificationTimer;
  
  const showNotification = () => {
    notification.classList.add('active');
    
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => {
      notification.classList.remove('active');
      notificationTimer = setTimeout(showNotification, 5000);
    }, 5000);
  };
  
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('active');
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(showNotification, 5000);
  });
  
  setTimeout(showNotification, 1000);
}

// Pagination functionality
export function setupPagination() {
  const prevBtn = document.querySelector('.pagination-btn.prev');
  const nextBtn = document.querySelector('.pagination-btn.next');
  const paginationText = document.querySelector('.pagination-text');
  
  if (!prevBtn || !nextBtn || !paginationText) return;
  
  let currentPage = 1;
  const totalPages = 2;
  
  const updatePagination = () => {
    paginationText.textContent = `${currentPage}/${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  };
  
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });
  
  updatePagination();
}