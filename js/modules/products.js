export function initProducts() {
  // Initialize product hover effects
  setupProductFeatures();
  setupPurchaseNotification();
  setupPagination();
  setupProductsView();
}


// Product features (images, color selection, nav buttons)
 function setupProductFeatures() {
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
 function setupPurchaseNotification() {
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
 function setupPagination() {
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

// products.js - Handles product display and view options

 function setupProductsView() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const productsGrid = document.querySelector('.products__grid');
  const productCards = document.querySelectorAll('.product-card');
  
  if (!viewButtons.length || !productsGrid) return;
  
  // Set initial grid layout
  productsGrid.classList.add('grid-3');
  
  // Initially animate in all product cards at once
  requestAnimationFrame(() => {
    productCards.forEach(card => {
      card.classList.add('animate-in');
    });
  });
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      viewButtons.forEach(btn => btn.classList.remove('view-btn--active'));
      
      // Add active class to clicked button
      this.classList.add('view-btn--active');
      
      // Remove animate-in class from all cards
      productCards.forEach(card => card.classList.remove('animate-in'));
      
      // Change grid layout based on selected view
      const icon = this.querySelector('i').className;
      
      // Remove all grid classes first
      productsGrid.classList.remove('grid-2', 'grid-3', 'grid-4', 'grid-1');
      
      // Add appropriate grid class
      if (icon.includes('sunny2')) {
        productsGrid.classList.add('grid-2');
      } else if (icon.includes('sunny3')) {
        productsGrid.classList.add('grid-3');
      } else if (icon.includes('sunny4')) {
        productsGrid.classList.add('grid-4');
      } else if (icon.includes('sunnyflex')) {
        productsGrid.classList.add('grid-1');
      }
      
      // Re-animate all product cards with a slower delay
      setTimeout(() => {
        productCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate-in');
          }, index * 50);
        });
      }, 30);
    });
  });
}