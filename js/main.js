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
  initFooterFunctionality();
  if (document.querySelector('.error-page')) {
    init404Page();
  }
  console.log('[Debug] Initialization complete');
});

// Handle page load
window.addEventListener('load', handlePageLoad);

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

document.addEventListener('DOMContentLoaded', function() {
  // Get both carousels
  const topCarousel = document.getElementById('topRowCarousel');
  const bottomCarousel = document.getElementById('bottomRowCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  
  // Get all product cards from both carousels
  const topProductCards = topCarousel.querySelectorAll('.product-card');
  const bottomProductCards = bottomCarousel.querySelectorAll('.product-card');
  
  // Calculate card width (including margin)
  const cardWidth = topProductCards[0].offsetWidth + 
                   parseInt(window.getComputedStyle(topProductCards[0]).marginLeft) + 
                   parseInt(window.getComputedStyle(topProductCards[0]).marginRight);
  
  // Clone products for infinite loop in both carousels
  function setupCarousel(carousel, productCards) {
    const cloneFirst = [];
    const cloneLast = [];
    
    // Clone first set of cards for appending at the end
    for (let i = 0; i < Math.min(getVisibleSlidesCount(), productCards.length); i++) {
      cloneFirst.push(productCards[i].cloneNode(true));
    }
    
    // Clone last set of cards for prepending at the beginning
    for (let i = Math.max(0, productCards.length - getVisibleSlidesCount()); i < productCards.length; i++) {
      cloneLast.push(productCards[i].cloneNode(true));
    }
    
    // Append clones
    cloneLast.reverse().forEach(clone => {
      carousel.insertBefore(clone, carousel.firstChild);
    });
    
    cloneFirst.forEach(clone => {
      carousel.appendChild(clone);
    });
    
    return {
      cloneFirst: cloneFirst.length,
      cloneLast: cloneLast.length
    };
  }
  
  // Set up both carousels
  const topCloneCount = setupCarousel(topCarousel, topProductCards);
  const bottomCloneCount = setupCarousel(bottomCarousel, bottomProductCards);
  
  // Get all cards after cloning for both carousels
  const allTopCards = topCarousel.querySelectorAll('.product-card');
  const allBottomCards = bottomCarousel.querySelectorAll('.product-card');
  
  // Set initial position to show the original first card in both carousels
  let currentIndex = topCloneCount.cloneLast;
  let topPosition = -currentIndex * cardWidth;
  let bottomPosition = -currentIndex * cardWidth;
  
  topCarousel.style.transform = `translateX(${topPosition}px)`;
  bottomCarousel.style.transform = `translateX(${bottomPosition}px)`;
  
  // Create dots (based on top carousel)
  const totalDots = Math.ceil((topProductCards.length - 1) / 2);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      // Calculate the exact slide to go to (always multiply by 2)
      const slideIndex = i * 2;
      goToSlide(Math.min(slideIndex, topProductCards.length - getVisibleSlidesCount()));
    });
    dotsContainer.appendChild(dot);
  }
  
  // Get the number of visible slides based on viewport width
  function getVisibleSlidesCount() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 576) return 1;
    if (windowWidth <= 992) return 2;
    if (windowWidth <= 1200) return 3;
    return 4;
  }
  
  // Update active dot
  function updateDots() {
    // With fixed 2-column navigation, we need to divide by 2
    const normalizedIndex = currentIndex - topCloneCount.cloneLast;
    const activeDotIndex = Math.floor(normalizedIndex / 2);
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index + topCloneCount.cloneLast;
    
    // Calculate positions for both carousels
    topPosition = -currentIndex * cardWidth;
    bottomPosition = -currentIndex * cardWidth;
    
    // Apply transitions with slower timing
    topCarousel.style.transition = 'transform 0.8s ease';
    bottomCarousel.style.transition = 'transform 0.8s ease';
    
    // Move both carousels
    topCarousel.style.transform = `translateX(${topPosition}px)`;
    bottomCarousel.style.transform = `translateX(${bottomPosition}px)`;
    
    updateDots();
  }
  
  // Next slide - always move by exactly 2 items
  function nextSlide() {
    // Always move by exactly 2 items
    const moveBy = 2;
    const maxIndex = allTopCards.length - getVisibleSlidesCount();
    
    if (currentIndex >= maxIndex) return;
    
    // Move by exactly 2 items, but don't go past the max
    const newIndex = Math.min(currentIndex + moveBy, maxIndex);
    currentIndex = newIndex;
    
    // Calculate positions for both carousels
    topPosition = -currentIndex * cardWidth;
    bottomPosition = -currentIndex * cardWidth;
    
    // Apply transitions with slower timing
    topCarousel.style.transition = 'transform 0.8s ease';
    bottomCarousel.style.transition = 'transform 0.8s ease';
    
    // Move both carousels
    topCarousel.style.transform = `translateX(${topPosition}px)`;
    bottomCarousel.style.transform = `translateX(${bottomPosition}px)`;
    
    updateDots();
  }
  
  // Previous slide - always move by exactly 2 items
  function prevSlide() {
    // Always move by exactly 2 items
    const moveBy = 2;
    
    if (currentIndex <= 0) return;
    
    // Move by exactly 2 items, but don't go below 0
    const newIndex = Math.max(currentIndex - moveBy, 0);
    currentIndex = newIndex;
    
    // Calculate positions for both carousels
    topPosition = -currentIndex * cardWidth;
    bottomPosition = -currentIndex * cardWidth;
    
    // Apply transitions with slower timing
    topCarousel.style.transition = 'transform 0.8s ease';
    bottomCarousel.style.transition = 'transform 0.8s ease';
    
    // Move both carousels
    topCarousel.style.transform = `translateX(${topPosition}px)`;
    bottomCarousel.style.transform = `translateX(${bottomPosition}px)`;
    
    updateDots();
  }
  
  // Handle infinite loop for both carousels
  function handleTransitionEnd(carousel, productCards, cloneCount) {
    carousel.addEventListener('transitionend', function() {
      // If we're at the cloned last slides
      if (currentIndex >= productCards.length + cloneCount.cloneLast) {
        currentIndex = cloneCount.cloneLast;
        const resetPosition = -currentIndex * cardWidth;
        
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${resetPosition}px)`;
      }
      
      // If we're at the cloned first slides
      if (currentIndex < cloneCount.cloneLast) {
        currentIndex = productCards.length + cloneCount.cloneLast - 1;
        const resetPosition = -currentIndex * cardWidth;
        
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${resetPosition}px)`;
      }
    });
  }
  
  // Setup infinite loop handling for both carousels
  handleTransitionEnd(topCarousel, topProductCards, topCloneCount);
  handleTransitionEnd(bottomCarousel, bottomProductCards, bottomCloneCount);
  
  // Event listeners for navigation buttons
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // Recalculate card width
    const newCardWidth = topProductCards[0].offsetWidth + 
                         parseInt(window.getComputedStyle(topProductCards[0]).marginLeft) + 
                         parseInt(window.getComputedStyle(topProductCards[0]).marginRight);
    
    // Reset positions without transition
    topPosition = -currentIndex * newCardWidth;
    bottomPosition = -currentIndex * newCardWidth;
    
    topCarousel.style.transition = 'none';
    bottomCarousel.style.transition = 'none';
    
    topCarousel.style.transform = `translateX(${topPosition}px)`;
    bottomCarousel.style.transform = `translateX(${bottomPosition}px)`;
    
    // Update dots for new visible slides count
    updateDotsCount();
    updateDots();
  });
  
  // Update dots count when screen size changes
  function updateDotsCount() {
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Always use 2 columns for navigation regardless of screen size
    const newTotalDots = Math.ceil((topProductCards.length - 1) / 2);
    
    for (let i = 0; i < newTotalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      
      // Calculate which dot should be active (always using 2-column movement)
      const normalizedIndex = currentIndex - topCloneCount.cloneLast;
      const activeDotIndex = Math.floor(normalizedIndex / 2);
      
      if (i === activeDotIndex) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        const slideIndex = i * 2;
        goToSlide(Math.min(slideIndex, topProductCards.length - getVisibleSlidesCount()));
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // ===== DRAG FUNCTIONALITY =====
  
  // Add touch/drag functionality to both carousels
  function addTouchDragFunctionality(carousel) {
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let dragged = false;
    
    // Add cursor styles to indicate draggable
    carousel.style.cursor = 'grab';
    
    // Prevent default behavior for images and links during drag
    const cards = carousel.querySelectorAll('.product-card');
    cards.forEach(card => {
      const images = card.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
      });
      
      // Prevent click navigation if dragged
      const links = card.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', e => {
          if (dragged) {
            e.preventDefault();
          }
        });
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
      
      // Apply the movement to this carousel only
      currentTranslate = prevTranslate + diff;
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
        nextSlide();
      } else if (movedBy > 100 || movedBy > cardWidth * 0.2) {
        // Dragged right - go to prev slide
        prevSlide();
      } else {
        // Snap to the current slide
        goToSlide(currentIndex - topCloneCount.cloneLast);
      }
    }
    
    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
  }
  
  // Add touch/drag functionality to both carousels
  addTouchDragFunctionality(topCarousel);
  addTouchDragFunctionality(bottomCarousel);
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

document.addEventListener('DOMContentLoaded', function() {
  // Get all the elements we need
  const sizeOptions = document.querySelectorAll('.size-selector__option');
  const currentSizeElement = document.querySelector('.size-selector__current');
  
  // Add click event listeners to each size option
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Get the size from the data attribute
      const selectedSize = this.dataset.size;
      
      // Update the current size display
      if (currentSizeElement) {
        currentSizeElement.textContent = selectedSize;
      }
      
      // Remove active class from all options
      sizeOptions.forEach(opt => {
        opt.classList.remove('size-selector__option--active');
      });
      
      // Add active class to the clicked option
      this.classList.add('size-selector__option--active');
      
      // Optional: dispatch custom event for integration with other components
      const event = new CustomEvent('sizeChange', {
        detail: {
          size: selectedSize
        }
      });
      document.dispatchEvent(event);
      
      // Optional: Update any hidden form fields if this is part of a form
      const sizeInput = document.querySelector('input[name="size"]');
      if (sizeInput) {
        sizeInput.value = selectedSize;
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // First carousel
  setupCarousel('track1', 'prevBtn1', 'nextBtn1');
  
  // Second carousel
  setupCarousel('track2', 'prevBtn2', 'nextBtn2');
  
  // Setup function for each carousel
  function setupCarousel(trackId, prevBtnId, nextBtnId) {
    const track = document.getElementById(trackId);
    const slides = Array.from(track.children);
    const prevButton = document.getElementById(prevBtnId);
    const nextButton = document.getElementById(nextBtnId);
    
    // Set initial position
    let currentIndex = 0;
    
    // Get the width of a slide (including margin)
    function getSlideWidth() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const style = window.getComputedStyle(slides[0]);
      const marginLeft = parseInt(style.marginLeft) || 0;
      const marginRight = parseInt(style.marginRight) || 0;
      return slideWidth + marginLeft + marginRight;
    }
    
    // Set slide positions
    function setSlidePositions() {
      const slideWidth = getSlideWidth();
      slides.forEach((slide, index) => {
        slide.style.left = `${slideWidth * index}px`;
      });
    }
    
    // Call this on load and when window resizes
    setSlidePositions();
    window.addEventListener('resize', () => {
      setSlidePositions();
      moveToSlide(track, slides[currentIndex], currentIndex);
    });
    
    // Move to slide
    function moveToSlide(track, targetSlide, targetIndex) {
      track.style.transform = `translateX(-${targetSlide.style.left})`;
      currentIndex = targetIndex;
      updateButtonStates();
    }
    
    // Handle button clicks
    prevButton.addEventListener('click', e => {
      // Get number of visible slides
      const visibleSlides = getVisibleSlidesCount();
      
      // Go back multiple slides if fewer than 4 are visible
      const moveBy = visibleSlides === 1 ? 1 : visibleSlides === 2 ? 2 : 3;
      
      const targetIndex = Math.max(currentIndex - moveBy, 0);
      const targetSlide = slides[targetIndex];
      moveToSlide(track, targetSlide, targetIndex);
    });
    
    nextButton.addEventListener('click', e => {
      // Get number of visible slides
      const visibleSlides = getVisibleSlidesCount();
      
      // Advance multiple slides if fewer than 4 are visible
      const moveBy = visibleSlides === 1 ? 1 : visibleSlides === 2 ? 2 : 3;
      
      const targetIndex = Math.min(currentIndex + moveBy, slides.length - visibleSlides);
      const targetSlide = slides[targetIndex];
      moveToSlide(track, targetSlide, targetIndex);
    });
    
    // Update button states (enable/disable)
    function updateButtonStates() {
      const visibleSlides = getVisibleSlidesCount();
      
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex >= slides.length - visibleSlides;
      
      prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
      nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }
    
    // Get the number of visible slides based on viewport width
    function getVisibleSlidesCount() {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 576) return 1;
      if (viewportWidth < 768) return 2;
      if (viewportWidth < 1024) return 3;
      return 4;
    }
    
    // Initial button state
    updateButtonStates();
    
    // Touch events for mobile swipe
    let startX, moveX;
    let isDragging = false;
    
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    track.addEventListener('touchmove', e => {
      if (!isDragging) return;
      moveX = e.touches[0].clientX;
      const diffX = moveX - startX;
      
      // Apply a small movement to give feedback
      track.style.transform = `translateX(calc(-${slides[currentIndex].style.left} + ${diffX / 3}px))`;
    });
    
    track.addEventListener('touchend', e => {
      isDragging = false;
      if (!moveX) return;
      
      const diffX = moveX - startX;
      const slideWidth = getSlideWidth();
      const threshold = slideWidth / 4; // 25% threshold
      
      if (diffX > threshold && currentIndex > 0) {
        // Swipe right - go to previous
        const targetIndex = currentIndex - 1;
        moveToSlide(track, slides[targetIndex], targetIndex);
      } else if (diffX < -threshold && currentIndex < slides.length - getVisibleSlidesCount()) {
        // Swipe left - go to next
        const targetIndex = currentIndex + 1;
        moveToSlide(track, slides[targetIndex], targetIndex);
      } else {
        // Reset to current position
        moveToSlide(track, slides[currentIndex], currentIndex);
      }
      
      startX = null;
      moveX = null;
    });
    
    // Reset if touch is canceled
    track.addEventListener('touchcancel', e => {
      isDragging = false;
      moveToSlide(track, slides[currentIndex], currentIndex);
      startX = null;
      moveX = null;
    });
  }
});