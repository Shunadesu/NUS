import { setupPageLoader, handlePageLoad } from './modules/loader.js';
import { setupNavigation } from './modules/navigation.js';
import { setupProductFeatures, setupPurchaseNotification, setupPagination } from './modules/products.js';
import { setupHeroSlider } from './modules/slider.js';
import { initCart } from './modules/cart.js';
import { setupSearch, submitSearch } from './modules/search.js';
import { setupLoginModal, setupCustomerService } from './modules/modals.js';
import { setupHelp } from './modules/ui.js';
import { setupRecentlyViewed, setupScrollTop, setupScrollingTopBar } from './modules/ui.js';
// Main initialization function

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  setupPageLoader();
  setupNavigation();
  setupProductFeatures();
  setupPurchaseNotification();
  setupPagination();

  setupScrollingTopBar();
  setupHeroSlider();
  setupSearch();
  submitSearch();
  setupLoginModal();
  
  setupHelp();
  setupRecentlyViewed();
  setupScrollTop();
  setupCustomerService();

  initCart()

  console.log('[Debug] Initialization complete');
});

// Handle page load
window.addEventListener('load', handlePageLoad);



// Mobile menu toggle functionality could be added here
// For example:
// const mobileMenuButton = document.querySelector('.mobile-menu-button');
// const nav = document.querySelector('.nav');
// 
// mobileMenuButton.addEventListener('click', () => {
//   nav.classList.toggle('nav--open');
// });

// You could add image lazy loading here
document.addEventListener('DOMContentLoaded', function() {
  // Initialize any JavaScript functionality
  
  // Example: Add animation classes when elements come into view
  const categories = document.querySelectorAll('.category');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  categories.forEach(category => {
    category.style.opacity = 0;
    category.style.transform = 'translateY(20px)';
    category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(category);
  });
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  
  
  // View options functionality
  const viewButtons = document.querySelectorAll('.view-btn');
  const productsGrid = document.querySelector('.products__grid');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      viewButtons.forEach(btn => btn.classList.remove('view-btn--active'));
      
      // Add active class to clicked button
      this.classList.add('view-btn--active');
      
      // Change grid layout based on selected view
      const icon = this.querySelector('i').className;
      
      if (icon.includes('sunny2')) {
        productsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else if (icon.includes('sunny3')) {
        productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      } else if (icon.includes('sunny4')) {
        productsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      } else if (icon.includes('sunnyflex')) {
        productsGrid.style.gridTemplateColumns = '1fr';
      }
    });
  });
  
  // Price slider functionality
  const priceSlider = document.querySelector('.price-slider');
  const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
  const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
  const range = document.querySelector('.price-slider__range');
  const minPrice = document.querySelector('.price-min');
  const maxPrice = document.querySelector('.price-max');
  
  let isDragging = false;
  let currentThumb = null;
  let startX = 0;
  let startLeft = 0;
  
  const minValue = 0;
  const maxValue = 200;
  let currentMinValue = minValue;
  let currentMaxValue = maxValue;
  
  function updatePriceRange() {
    const track = priceSlider.querySelector('.price-slider__track');
    const trackWidth = track.offsetWidth;
    
    const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
    const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
    
    minThumb.style.left = `${minPercent}%`;
    maxThumb.style.left = `${maxPercent}%`;
    
    range.style.left = `${minPercent}%`;
    range.style.right = `${100 - maxPercent}%`;
    
    minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
    maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
  }
  
  function startDrag(e, thumb) {
    e.preventDefault();
    isDragging = true;
    currentThumb = thumb;
    
    startX = e.clientX || e.touches[0].clientX;
    startLeft = parseFloat(currentThumb.style.left) || 
                (currentThumb.dataset.value === 'min' ? 0 : 100);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    const track = priceSlider.querySelector('.price-slider__track');
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const deltaX = clientX - startX;
    const deltaPercent = (deltaX / trackWidth) * 100;
    let newLeft = startLeft + deltaPercent;
    
    // Constrain to track bounds
    newLeft = Math.max(0, Math.min(100, newLeft));
    
    // Prevent thumbs from crossing
    if (currentThumb.dataset.value === 'min') {
      const maxLeft = parseFloat(maxThumb.style.left) || 100;
      newLeft = Math.min(newLeft, maxLeft - 5);
      currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
    } else {
      const minLeft = parseFloat(minThumb.style.left) || 0;
      newLeft = Math.max(newLeft, minLeft + 5);
      currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
    }
    
    currentThumb.style.left = `${newLeft}%`;
    updatePriceRange();
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
  
  minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
  minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
  maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
  maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
  
  // Initialize price slider
  updatePriceRange();
  
  // Product hover effects
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const img = this.querySelector('.product-card__image img');
      img.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
      const img = this.querySelector('.product-card__image img');
      img.style.transform = 'scale(1)';
    });
  });
  
  const paginationContainer = document.querySelector('.pagination');
  const prevButton = document.querySelector('.pagination__btn--prev');
  const nextButton = document.querySelector('.pagination__btn--next');
  
  let currentPage = 1;
  let totalPages = 3;           // số trang đang hiển thị
  const maxPages = 10;          // số trang tối đa có thể thêm
  
  // Tạo nút trang
  function createPageButton(pageNumber) {
    const btn = document.createElement('button');
    btn.className = 'pagination__btn';
    btn.textContent = pageNumber;
  
    btn.addEventListener('click', function () {
      currentPage = pageNumber;
      activatePage(currentPage);
  
      if (currentPage === totalPages && totalPages < maxPages) {
        totalPages++;
        const newBtn = createPageButton(totalPages);
        paginationContainer.insertBefore(newBtn, nextButton);
      }
    });
  
    return btn;
  }
  
  // Kích hoạt trang
  function activatePage(pageNumber) {
    document.querySelectorAll('.pagination__btn').forEach(btn => {
      if (!btn.classList.contains('pagination__btn--prev') && !btn.classList.contains('pagination__btn--next')) {
        btn.classList.toggle('pagination__btn--active', parseInt(btn.textContent) === pageNumber);
      }
    });
  
    prevButton.disabled = pageNumber === 1;
    nextButton.disabled = (pageNumber === maxPages);
    console.log(`Đang ở trang ${pageNumber}`);
  }
  
  // Prev
  prevButton.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      activatePage(currentPage);
    }
  });
  
  // Next
  nextButton.addEventListener('click', function () {
    if (currentPage < maxPages) {
      currentPage++;
      activatePage(currentPage);
  
      if (currentPage === totalPages && totalPages < maxPages) {
        totalPages++;
        const newBtn = createPageButton(totalPages);
        paginationContainer.insertBefore(newBtn, nextButton);
      }
    }
  });
  
  // Khởi tạo ban đầu
  for (let i = 1; i <= totalPages; i++) {
    const btn = createPageButton(i);
    if (i === currentPage) btn.classList.add('pagination__btn--active');
    paginationContainer.insertBefore(btn, nextButton);
  }
});

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
  // Filter toggle functionality
  const filterToggles = document.querySelectorAll('.filter__toggle');
  
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const filterContent = this.closest('.filter').querySelector('.filter__content');
      const minusIcon = this.querySelector('.minus');
      
      if (filterContent.style.display === 'none') {
        filterContent.style.display = 'block';
        filterContent.style.maxHeight = '100%';
        minusIcon.textContent = '−';
      } else {
        filterContent.style.display = 'none';
        filterContent.style.maxHeight = '0';
        minusIcon.textContent = '+';
      }
    });
  });

  // Price slider functionality
  const priceSlider = document.querySelector('.price-slider');
  if (priceSlider) {
    const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
    const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
    const range = document.querySelector('.price-slider__range');
    const minPrice = document.querySelector('.price-min');
    const maxPrice = document.querySelector('.price-max');
    
    let isDragging = false;
    let currentThumb = null;
    let startX = 0;
    let startLeft = 0;
    
    const minValue = 0;
    const maxValue = 200;
    let currentMinValue = minValue;
    let currentMaxValue = maxValue;
    
    function updatePriceRange() {
      const track = priceSlider.querySelector('.price-slider__track');
      const trackWidth = track.offsetWidth;
      
      const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
      const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
      
      minThumb.style.left = `${minPercent}%`;
      maxThumb.style.left = `${maxPercent}%`;
      
      range.style.left = `${minPercent}%`;
      range.style.right = `${100 - maxPercent}%`;
      
      minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
      maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
    }
    
    function startDrag(e, thumb) {
      e.preventDefault();
      isDragging = true;
      currentThumb = thumb;
      
      startX = e.clientX || e.touches[0].clientX;
      startLeft = parseFloat(currentThumb.style.left) || 
                  (currentThumb.dataset.value === 'min' ? 0 : 100);
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
      if (!isDragging) return;
      
      const track = priceSlider.querySelector('.price-slider__track');
      const trackRect = track.getBoundingClientRect();
      const trackWidth = trackRect.width;
      
      const clientX = e.clientX || e.touches[0].clientX;
      const deltaX = clientX - startX;
      const deltaPercent = (deltaX / trackWidth) * 100;
      let newLeft = startLeft + deltaPercent;
      
      // Constrain to track bounds
      newLeft = Math.max(0, Math.min(100, newLeft));
      
      // Prevent thumbs from crossing
      if (currentThumb.dataset.value === 'min') {
        const maxLeft = parseFloat(maxThumb.style.left) || 100;
        newLeft = Math.min(newLeft, maxLeft - 5);
        currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
      } else {
        const minLeft = parseFloat(minThumb.style.left) || 0;
        newLeft = Math.max(newLeft, minLeft + 5);
        currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
      }
      
      currentThumb.style.left = `${newLeft}%`;
      updatePriceRange();
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
    
    minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
    minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
    maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
    maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
    
    // Initialize price slider
    updatePriceRange();
  }

  // Color filter selection
  const colorFilters = document.querySelectorAll('.color-filter');
  colorFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
    });
  });

  // Size filter selection
  const sizeFilters = document.querySelectorAll('.size-filter');
  sizeFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const sidebar = document.querySelector('.sidebar');
  const mainnav = document.querySelector('.nav__list');

  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 0) {
      if (currentScroll > lastScrollTop) {
        // Cuộn xuống
        header.classList.add('shrink');
        sidebar.classList.add('hide');
        mainnav.classList.remove('main_nav');
      } else {
        // Cuộn lên
        // header.classList.remove('shrink');
        // sidebar.classList.remove('hide');
        // mainnav.classList.add('main_nav');
      }
    }if (currentScroll === 0) {
      header.classList.remove('shrink');
      sidebar.classList.remove('hide');
      mainnav.classList.add('main_nav');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // prevent negative scroll
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Thumbnail gallery
  const thumbnails = document.querySelectorAll(".thumbnail")
  const thumbnailsContainer = document.querySelector(".thumbnails-container")
  const mainImage = document.getElementById("mainImage")
  const prevBtn = document.querySelector(".thumbnail-prev")
  const nextBtn = document.querySelector(".thumbnail-next")

  // Set up thumbnail navigation
  let currentIndex = 0
  const thumbnailHeight = 90 + 12 // Height + gap
  const thumbnailWidth = 70 + 12 // Width + gap for mobile
  const visibleThumbnails = 4 // Number of thumbnails visible at once

  // Function to update main image
  function updateMainImage(index) {
    // Fade out current image
    mainImage.style.opacity = "0"

    // After fade out, update src and fade in
    setTimeout(() => {
      const imgSrc = thumbnails[index].querySelector("img").src
      mainImage.src = imgSrc
      document.getElementById("zoomedImage").src = imgSrc
      mainImage.style.opacity = "1"
    }, 200)
  }

  // Function to update active thumbnail
  function updateActiveThumbnail(index) {
    thumbnails.forEach((t) => t.classList.remove("active"))
    thumbnails[index].classList.add("active")
    currentIndex = index

    // Slide the thumbnails to keep active one in view
    const isMobile = window.innerWidth <= 576

    if (isMobile) {
      thumbnailsContainer.style.transform = `translateX(-${currentIndex * thumbnailWidth}px)`
    } else {
      // Calculate position to center the active thumbnail
      const containerHeight = visibleThumbnails * thumbnailHeight
      let offset = currentIndex * thumbnailHeight - (containerHeight - thumbnailHeight) / 2

      // Clamp the offset to prevent overscrolling
      const maxOffset = thumbnails.length * thumbnailHeight - containerHeight
      offset = Math.max(0, Math.min(offset, maxOffset))

      thumbnailsContainer.style.transform = `translateY(-${offset}px)`
    }
  }

  // Thumbnail click handler
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateActiveThumbnail(index)
      updateMainImage(index)
    })
  })

  // Previous button click handler
  prevBtn.addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length
    updateActiveThumbnail(newIndex)
    updateMainImage(newIndex)
  })

  // Next button click handler
  nextBtn.addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % thumbnails.length
    updateActiveThumbnail(newIndex)
    updateMainImage(newIndex)
  })

  // Main image navigation buttons
  const mainPrevBtn = document.querySelector(".main-prev")
  const mainNextBtn = document.querySelector(".main-next")

  // Main prev button click handler
  mainPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent event bubbling
    const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length
    updateActiveThumbnail(newIndex)
    updateMainImage(newIndex)
  })

  // Main next button click handler
  mainNextBtn.addEventListener("click", (e) => {
    e.stopPropagation() // Prevent event bubbling
    const newIndex = (currentIndex + 1) % thumbnails.length
    updateActiveThumbnail(newIndex)
    updateMainImage(newIndex)
  })

  // Handle window resize for responsive behavior
  window.addEventListener("resize", () => {
    // Recalculate positions based on current device orientation
    updateActiveThumbnail(currentIndex)
  })

  // Image zoom functionality
  const zoomBtn = document.getElementById("zoomBtn")
  const imageModal = document.getElementById("imageModal")
  const closeModal = document.querySelector(".close-modal")

  zoomBtn.addEventListener("click", () => {
    imageModal.style.display = "block"
  })

  closeModal.addEventListener("click", () => {
    imageModal.style.display = "none"
  })

  // Close modal when clicking outside the image
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      imageModal.style.display = "none"
    }
  })

  // Color selection
  const colorOptions = document.querySelectorAll(".color-option")
  const selectedColorText = document.querySelector(".selected-option")

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Update selected color
      colorOptions.forEach((o) => o.classList.remove("selected"))
      this.classList.add("selected")

      // Update selected color text
      const colorName = this.getAttribute("data-color")
      selectedColorText.textContent = colorName
    })
  })

  // Quantity selector
  const quantityInput = document.querySelector(".quantity-input")
  const decreaseBtn = document.querySelector(".quantity-decrease")
  const increaseBtn = document.querySelector(".quantity-increase")

  decreaseBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value > 1) {
      quantityInput.value = value - 1
    }
  })

  increaseBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value < Number.parseInt(quantityInput.max)) {
      quantityInput.value = value + 1
    }
  })

  // File upload
  const fileInput = document.getElementById("customImage")
  const fileInfo = document.querySelector(".file-upload__info")
  const fileBtn = document.querySelector(".file-upload__btn")

  fileBtn.addEventListener("click", () => {
    fileInput.click()
  })

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileInfo.textContent = this.files[0].name
    } else {
      fileInfo.textContent = "No file chosen"
    }
  })

  // Add to cart functionality
  const addToCartBtn = document.querySelector(".add-to-cart-btn")
  const cartCount = document.querySelector(".cart-count")

  addToCartBtn.addEventListener("click", () => {
    // Get selected options
    const selectedColor = document.querySelector(".color-option.selected").getAttribute("data-color")
    const quantity = Number.parseInt(quantityInput.value)
    const customNote = document.getElementById("customNote").value

    // Create cart item object
    const cartItem = {
      name: "Striped Ribbed T-shirt",
      color: selectedColor,
      quantity: quantity,
      price: 116.0,
      customNote: customNote,
      image: mainImage.src,
    }

    // In a real application, you would add this to cart storage
    console.log("Added to cart:", cartItem)

    // Update cart count (for demo purposes)
    const currentCount = Number.parseInt(cartCount.textContent)
    cartCount.textContent = currentCount + quantity

    // Show confirmation message
    showNotification("Product added to cart successfully!")
  })

  // Wishlist functionality
  const wishlistBtn = document.querySelector(".wishlist-btn")

  wishlistBtn.addEventListener("click", function () {
    this.classList.toggle("active")

    if (this.classList.contains("active")) {
      this.innerHTML = '<i class="fas fa-heart"></i>'
      showNotification("Product added to wishlist!")
    } else {
      this.innerHTML = '<i class="far fa-heart"></i>'
      showNotification("Product removed from wishlist!")
    }
  })

  // Compare functionality
  const compareBtn = document.querySelector(".compare-btn")

  compareBtn.addEventListener("click", function () {
    this.classList.toggle("active")
    showNotification("Product added to compare list!")
  })

  // Notification function
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    // Add to body
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Remove notification after delay
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Add notification styles
  const style = document.createElement("style")
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--primary-color);
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: var(--shadow-md);
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
      z-index: 1000;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
  `
  document.head.appendChild(style)

  // Update the main image source URL in the HTML
  // In the HTML, update the main image source to match the first thumbnail:
  const mainImageSrc = document.querySelector(".thumbnail.active img").src
  document.getElementById("mainImage").src = mainImageSrc
  document.getElementById("zoomedImage").src = mainImageSrc
})
