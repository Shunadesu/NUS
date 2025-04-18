import { setupPageLoader, handlePageLoad } from './modules/loader.js';
import { setupNavigation } from './modules/navigation.js';
import { setupHeroSlider } from './modules/slider.js';
import { setupSearch, submitSearch } from './modules/search.js';
import { initModals } from './modules/modal.js';
import { initUI } from './modules/ui.js';
import { initProducts } from './modules/products.js';
import { initCart } from './modules/cart.js';
import { initPagination } from './modules/pagnigation.js';                 
import { initProductOptions } from './modules/product-options.js';
import { initFullscreenGallery } from './modules/fullscreen-gallery.js';
import { initGallery } from './modules/gallery.js';
import { initNotifications } from './modules/notification.js';
import { initFilters } from './modules/filter.js';
import { initFooterFunctionality } from './modules/footer.js';
import {init404Page} from './modules/404.js';


document.addEventListener('DOMContentLoaded', function() {
  initFooterFunctionality();
  setupPageLoader();
  setupNavigation();
  setupHeroSlider();
  setupSearch();
  submitSearch();
  initUI();

  // Initialize all components
  initNotifications();
  initModals();
  initProducts();
  initFilters();
  initPagination();
  initGallery();
  initFullscreenGallery();
  initProductOptions();
  initCart();  
  initFooterFunctionality();
  if (document.querySelector('.error-page')) {
    init404Page();
  }
  console.log('[Debug] Initialization complete');
});

// Handle page load
window.addEventListener('load', handlePageLoad);


// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const sidebar = document.querySelector('.sidebar');
  const mainnav = document.querySelector('.nav__list');

  const logoWhite = document.querySelector('.logo_div.white');
  const logoNormal = document.querySelector('.logo_div:not(.white)');

  let lastScrollTop = 0;+

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 0) {
      if (currentScroll > lastScrollTop) {
        // Cuộn xuống
        header.classList.add('shrink');
        sidebar.classList.add('hide');
        mainnav.classList.remove('main_nav');


         // Toggle logo visibility
         logoWhite.style.display = 'none';
         logoNormal.style.display = 'block';
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
      logoWhite.style.display = 'block';
      logoNormal.style.display = 'none';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // prevent negative scroll
  });
});

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

document.addEventListener('DOMContentLoaded', () => {
  // Slider elements
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');
  const indicators = document.querySelectorAll('.indicator');
  
  // Variables for slider state
  let currentIndex = 0;
  const totalSlides = slides.length;
  let startX, currentTranslate, isDragging = false, animationID, prevTranslate = 0;
  
  // Initialize
  updateTrackPosition(false);
  updateIndicators();
  
  // Set up grab and slide functionality
  track.addEventListener('mousedown', dragStart);
  track.addEventListener('touchstart', dragStart);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('touchend', dragEnd);
  track.addEventListener('mouseleave', dragEnd);
  track.addEventListener('mousemove', drag);
  track.addEventListener('touchmove', drag);
  
  // Prevent context menu on long press
  window.oncontextmenu = function(event) {
    if (event.target.closest('.testimonial-track')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }
  
  // Drag functions
  function dragStart(event) {
    startX = getPositionX(event);
    isDragging = true;
    track.classList.add('grabbing');
    
    // Stop any existing animation
    cancelAnimationFrame(animationID);
    
    // Record the current translation
    prevTranslate = currentTranslate;
  }
  
  function drag(event) {
    if (isDragging) {
      const currentX = getPositionX(event);
      const diff = currentX - startX;
      setTrackPosition(prevTranslate + diff);
    }
  }
  
  function dragEnd() {
    isDragging = false;
    track.classList.remove('grabbing');
    
    // Determine which direction to snap based on drag distance
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentIndex < totalSlides - 1) {
      // Dragged left - go to next slide
      currentIndex++;
    } else if (movedBy > 100 && currentIndex > 0) {
      // Dragged right - go to previous slide
      currentIndex--;
    }
    
    // Snap to the closest slide
    updateTrackPosition(true);
    updateIndicators();
  }
  
  // Helper functions
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  function setTrackPosition(position) {
    currentTranslate = position;
    track.style.transform = `translateX(${position}px)`;
  }
  
  function updateTrackPosition(animate = true) {
    // Calculate position based on slide width
    const slideWidth = document.querySelector('.testimonial-slide').offsetWidth;
    const newPosition = -currentIndex * slideWidth;
    
    // Apply or remove transition based on whether we're animating
    track.style.transition = animate ? `transform var(--transition-normal)` : 'none';
    
    // Set the new position
    setTrackPosition(newPosition);
    prevTranslate = newPosition;
  }
  
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Button click handlers
  function goToNext() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateTrackPosition();
      updateIndicators();
    }
  }
  
  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateTrackPosition();
      updateIndicators();
    }
  }
  
  // Event listeners for buttons
  prevButton.addEventListener('click', goToPrev);
  nextButton.addEventListener('click', goToNext);
  
  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateTrackPosition();
      updateIndicators();
    });
  });
  
  // Handle window resize to ensure correct positioning
  window.addEventListener('resize', () => {
    // Temporarily remove transition for instant repositioning
    updateTrackPosition(false);
  });
  
  // Optional: Auto-advance slides every 5 seconds
  let autoAdvanceTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateTrackPosition();
    updateIndicators();
  }, 5000);
  
  // Stop auto-advance when user interacts with slider
  document.querySelector('.testimonial-container').addEventListener('mouseenter', () => {
    clearInterval(autoAdvanceTimer);
  });
  
  // Optional: Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('productCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  
  // Get all product cards
  const productCards = carousel.querySelectorAll('.product-card');
  const cardWidth = productCards[0].offsetWidth + 20; // Card width + margin
  
  // Clone products for infinite loop
  const cloneFirst = [];
  const cloneLast = [];
  
  // Clone first set of cards for appending at the end
  for (let i = 0; i < Math.min(4, productCards.length); i++) {
    cloneFirst.push(productCards[i].cloneNode(true));
  }
  
  // Clone last set of cards for prepending at the beginning
  for (let i = Math.max(0, productCards.length - 4); i < productCards.length; i++) {
    cloneLast.push(productCards[i].cloneNode(true));
  }
  
  // Append clones
  cloneLast.reverse().forEach(clone => {
    carousel.insertBefore(clone, carousel.firstChild);
  });
  
  cloneFirst.forEach(clone => {
    carousel.appendChild(clone);
  });
  
  // Update all cards after cloning
  const allCards = carousel.querySelectorAll('.product-card');
  
  // Set initial position to show the original first card
  let currentIndex = cloneLast.length;
  let position = -currentIndex * cardWidth;
  carousel.style.transform = `translateX(${position}px)`;
  
  // Create dots
  const totalDots = productCards.length;
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  }
  
  // Update active dot
  function updateDots() {
    const activeDotIndex = (currentIndex - cloneLast.length) % productCards.length;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index + cloneLast.length;
    position = -currentIndex * cardWidth;
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${position}px)`;
    updateDots();
  }
  
  // Next slide
  function nextSlide() {
    currentIndex++;
    position = -currentIndex * cardWidth;
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${position}px)`;
    updateDots();
  }
  
  // Previous slide
  function prevSlide() {
    currentIndex--;
    position = -currentIndex * cardWidth;
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${position}px)`;
    updateDots();
  }
  
  // Handle infinite loop
  carousel.addEventListener('transitionend', function() {
    // If we're at the cloned last slides
    if (currentIndex >= productCards.length + cloneLast.length) {
      currentIndex = cloneLast.length;
      position = -currentIndex * cardWidth;
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${position}px)`;
    }
    
    // If we're at the cloned first slides
    if (currentIndex < cloneLast.length) {
      currentIndex = productCards.length + cloneLast.length - 1;
      position = -currentIndex * cardWidth;
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${position}px)`;
    }
    
    updateDots();
  });
  
  // Event listeners for buttons
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Autoplay
  let autoplayInterval;
  
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000);
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Start autoplay
  startAutoplay();
  
  // Pause autoplay on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  
  // Pause autoplay when user interacts with controls
  prevBtn.addEventListener('mouseenter', stopAutoplay);
  nextBtn.addEventListener('mouseenter', stopAutoplay);
  prevBtn.addEventListener('mouseleave', startAutoplay);
  nextBtn.addEventListener('mouseleave', startAutoplay);
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const newCardWidth = productCards[0].offsetWidth + 20;
    if (newCardWidth !== cardWidth) {
      // Recalculate position based on new card width
      position = -currentIndex * newCardWidth;
      carousel.style.transition = 'none';
      carousel.style.transform = `translateX(${position}px)`;
    }
  });
  
  // ===== DRAG FUNCTIONALITY =====
  
  // Variables for drag functionality
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let dragged = false;
  
  // Add cursor styles to indicate draggable
  carousel.style.cursor = 'grab';
  
  // Prevent default behavior for images and links during drag
  allCards.forEach(card => {
    const images = card.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
    
    card.addEventListener('click', e => {
      if (dragged) {
        e.preventDefault();
      }
    });
  });
  
  // Touch events
  carousel.addEventListener('touchstart', touchStart);
  carousel.addEventListener('touchmove', touchMove);
  carousel.addEventListener('touchend', touchEnd);
  
  // Mouse events
  carousel.addEventListener('mousedown', touchStart);
  carousel.addEventListener('mousemove', touchMove);
  carousel.addEventListener('mouseup', touchEnd);
  carousel.addEventListener('mouseleave', touchEnd);
  
  function touchStart(event) {
    stopAutoplay();
    dragged = false;
    
    // Get start position
    startPosition = getPositionX(event);
    isDragging = true;
    
    // Change cursor style
    carousel.style.cursor = 'grabbing';
    
    // Get current position from transform
    const transform = getComputedStyle(carousel).transform;
    const matrix = new DOMMatrix(transform);
    currentTranslate = matrix.m41;
    prevTranslate = currentTranslate;
    
    // Stop any current animation
    cancelAnimationFrame(animationID);
    
    // Remove transition during drag
    carousel.style.transition = 'none';
  }
  
  function touchMove(event) {
    if (!isDragging) return;
    
    // Calculate how far the user has dragged
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPosition;
    
    // Update position with drag amount
    currentTranslate = prevTranslate + diff;
    
    // Apply transform
    carousel.style.transform = `translateX(${currentTranslate}px)`;
    
    // If dragged more than 5px, consider it a drag not a click
    if (Math.abs(diff) > 5) {
      dragged = true;
    }
  }
  
  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    // Change cursor back
    carousel.style.cursor = 'grab';
    
    // Calculate which slide to snap to
    const movedBy = currentTranslate - prevTranslate;
    
    // If dragged more than 100px or 20% of card width, move to next/prev slide
    if (movedBy < -100 || movedBy < -cardWidth * 0.2) {
      // Dragged left - go to next slide
      currentIndex++;
    } else if (movedBy > 100 || movedBy > cardWidth * 0.2) {
      // Dragged right - go to prev slide
      currentIndex--;
    }
    
    // Snap to the closest slide
    position = -currentIndex * cardWidth;
    carousel.style.transition = 'transform 0.5s ease';
    carousel.style.transform = `translateX(${position}px)`;
    
    updateDots();
    startAutoplay();
  }
  
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
});