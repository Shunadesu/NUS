// --- Helper: Throttle function ---
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Global variables
let sliderContainer = null;
let rows = [];
let prevBtn = null;
let nextBtn = null;
let dotsContainer = null;
let originalProducts = [];
let numProducts = 0;
let currentSlide = 0;
let isTransitioning = false;
let dotElements = [];
let logicalTotalSlides = 0;
let settings = {};
let autoplayInterval = null;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let startTranslate = 0;
let animationFrameId = null;
let slideWidth = 0;
let productsPerRow = 4;

export function initShopCarousel(container, options = {}) {
  // Reset all global variables
  currentSlide = 0;
  isTransitioning = false;
  dotElements = [];
  logicalTotalSlides = 0;
  isDragging = false;
  startX = 0;
  currentTranslate = 0;
  startTranslate = 0;
  animationFrameId = null;
  slideWidth = 0;
  
  // Setup options
  const defaultOptions = {
    autoplay: true,
    autoplayDelay: 5000,
    infinite: true,
    transitionDuration: 300
  };
  
  settings = { ...defaultOptions, ...options };
  
  // Initialize carousel
  init(container);
}

function calculateItemsPerView() {
  const width = window.innerWidth;
  if (width <= 468) {
    return 2;
  } else if (width <= 1024) {
    return 3;
  }
  return 4;
}

function updateCarouselStructure() {
  const itemsPerView = calculateItemsPerView();
  logicalTotalSlides = Math.ceil(numProducts / (itemsPerView * rows.length));
  
  // Recreate dots based on new total slides
  createDots();
  
  // Reset to first slide
  currentSlide = settings.infinite ? 1 : 0;
  updateSlide(false);
}

function createDots() {
  if (!dotsContainer) return;
  
  // Clear existing dots
  dotsContainer.innerHTML = '';
  dotElements = [];
  
  // Calculate total number of slides
  const itemsPerView = calculateItemsPerView();
  logicalTotalSlides = Math.ceil(numProducts / itemsPerView);
  
  // Create dots
  for (let i = 0; i < logicalTotalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      
      dot.addEventListener('click', () => {
          if (isTransitioning) return;
          goToSlide(i);
      });
      
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
  }
  
  // Set initial active dot
  if (dotElements.length > 0) {
      dotElements[0].classList.add('active');
  }
}

function setupRows() {
  if (!rows || !rows.length) return;
  
  const itemsPerView = calculateItemsPerView();
  
  Array.from(rows).forEach(row => {
      row.innerHTML = '';
      const products = originalProducts.map(p => p.cloneNode(true));
      
      if (settings.infinite) {
          // Add clones at start
          const endClones = products.slice(-itemsPerView).map(p => p.cloneNode(true));
          endClones.forEach(clone => {
              clone.classList.add('clone');
              row.appendChild(clone);
          });
          
          // Add original products
          products.forEach(product => row.appendChild(product));
          
          // Add clones at end
          const startClones = products.slice(0, itemsPerView).map(p => p.cloneNode(true));
          startClones.forEach(clone => {
              clone.classList.add('clone');
              row.appendChild(clone);
          });
      } else {
          products.forEach(product => row.appendChild(product));
      }
  });
  
  calculateAndSetRowWidth();
}

function calculateAndSetRowWidth() {
  if (rows.length > 0 && numProducts > 0) {
      const itemsPerView = calculateItemsPerView();
      const totalSlides = Math.ceil(numProducts / itemsPerView);
      
      rows.forEach(row => {
          row.style.width = `${totalSlides * 100}%`;
          const items = row.querySelectorAll('.product-card');
          
          items.forEach(item => {
              const width = `${100 / (totalSlides * itemsPerView)}%`;
              item.style.width = width;
              item.style.flex = `0 0 ${width}`;
          });
      });
  }
}

function calculateSlideWidth() {
  if (sliderContainer) {
      slideWidth = sliderContainer.offsetWidth;
  }
}

function setPosition(translate) {
  rows.forEach(row => {
      row.style.transform = `translateX(${translate}px)`;
  });
}

function updateSlide(animate = true) {
  if (isTransitioning) return;
  
  const slideWidth = sliderContainer.offsetWidth;
  const translate = -currentSlide * slideWidth;
  
  if (animate) {
      isTransitioning = true;
      rows.forEach(row => {
          row.style.transition = 'transform 0.3s ease';
      });
  } else {
      rows.forEach(row => {
          row.style.transition = 'none';
      });
  }
  
  setPosition(translate);
  
  // Update dots
  const logicalSlide = settings.infinite ? 
      (currentSlide - 1 + logicalTotalSlides) % logicalTotalSlides : 
      currentSlide;
  
  dotElements.forEach((dot, index) => {
      dot.classList.toggle('active', index === logicalSlide);
  });
  
  // Update buttons
  if (!settings.infinite) {
      prevBtn?.classList.toggle('disabled', currentSlide === 0);
      nextBtn?.classList.toggle('disabled', currentSlide >= logicalTotalSlides - 1);
  }
}

function handleInfiniteLoopJump() {
  if (!settings.infinite || !isTransitioning) return;
  
  const slideWidth = sliderContainer.offsetWidth;
  
  if (currentSlide >= logicalTotalSlides + 1) {
      currentSlide = 1;
      rows.forEach(row => {
          row.style.transition = 'none';
          row.style.transform = `translateX(-${slideWidth}px)`;
      });
  } else if (currentSlide <= 0) {
      currentSlide = logicalTotalSlides;
      rows.forEach(row => {
          row.style.transition = 'none';
          row.style.transform = `translateX(-${logicalTotalSlides * slideWidth}px)`;
      });
  }
  
  isTransitioning = false;
}

function goToSlide(index) {
  if (isTransitioning) return;
  
  currentSlide = settings.infinite ? index + 1 : index;
  updateSlide(true);
}

function prevSlide() {
  if (isTransitioning) return;
  if (!settings.infinite && currentSlide <= 0) return;
  
  currentSlide--;
  updateSlide(true);
}

function nextSlide() {
  if (isTransitioning) return;
  if (!settings.infinite && currentSlide >= logicalTotalSlides - 1) return;
  
  currentSlide++;
  updateSlide(true);
}

// --- Autoplay Functions ---
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

function startAutoplay() {
    stopAutoplay(); // Clear any existing timer
    if (settings.autoplay && logicalTotalSlides > 1) { // Only autoplay if enabled and more than one slide
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, settings.autoplayDelay);
    }
}

// --- Dragging Event Handlers ---
function dragStart(e) {
    if (isTransitioning || logicalTotalSlides <= 1) return;
    stopAutoplay();
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    
    if (rows && rows[0]) {
        const currentTransform = window.getComputedStyle(rows[0]).transform;
        startTranslate = currentTransform !== 'none' ? parseFloat(currentTransform.split(',')[4]) || 0 : 0;
        currentTranslate = startTranslate;
    }
    
    if (sliderContainer) {
        sliderContainer.classList.add('is-dragging');
    }
    
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(dragUpdateLoop);
}

function dragUpdateLoop() {
     if (!isDragging) return;
     // Apply the current translate value
     setPosition(currentTranslate);
     // Continue the loop
     animationFrameId = requestAnimationFrame(dragUpdateLoop);
}

function dragMove(e) {
    if (!isDragging) return;
    
    const currentX = e.pageX || e.touches[0].pageX;
    const deltaX = currentX - startX;
    currentTranslate = startTranslate + deltaX;
    
    // No need to call setPosition here directly, dragUpdateLoop handles it
    // This reduces layout thrashing
}

function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationFrameId);
    
    if (sliderContainer) {
        sliderContainer.classList.remove('is-dragging');
    }
    
    const movedBy = currentTranslate - startTranslate;
    const dragThreshold = slideWidth / 5;
    
    let targetSlide = currentSlide;
    
    if (movedBy < -dragThreshold) {
        targetSlide = currentSlide + 1;
    } else if (movedBy > dragThreshold) {
        targetSlide = currentSlide - 1;
    }
    
    goToSlide(targetSlide);
    startAutoplay();
}

// --- Setup Event Listeners ---
function setupEventListeners(container) {
    if (!container) return;

    // Buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
        });
    }
    
    // Dragging
    if (sliderContainer) {
        sliderContainer.addEventListener('mousedown', dragStart);
        sliderContainer.addEventListener('touchstart', dragStart, { passive: true });
    }
    
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, { passive: true }); 
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mouseleave', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('touchcancel', dragEnd);

    // Autoplay Pause/Resume on Hover
    if (settings.autoplay) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    // Add resize handler
    const handleResize = () => {
        calculateSlideWidth();
        calculateAndSetRowWidth();
        updateCarouselStructure();
    };
    
    const throttledResizeHandler = throttle(handleResize, 250);
    window.addEventListener('resize', throttledResizeHandler);
    
    // Transition End for Infinite Loop Jump
    if (rows) {
        Array.from(rows).forEach(row => {
            row.addEventListener('transitionend', handleInfiniteLoopJump);
        });
    }
}

// --- Initialization ---
function init(container) {
  if (!container) return;
  
  // Get elements
  sliderContainer = container.querySelector('.shopcarousel__slider-container');
  rows = container.querySelectorAll('.shopcarousel__row');
  prevBtn = container.querySelector('.shopcarousel__nav--prev');
  nextBtn = container.querySelector('.shopcarousel__nav--next');
  dotsContainer = container.querySelector('.shopcarousel__dots');
  
  // Validate required elements
  if (!sliderContainer || !rows.length || !dotsContainer) {
      console.error('Required carousel elements not found');
      return;
  }
  
  // Get products
  originalProducts = Array.from(container.querySelectorAll('.shopcarousel__row .product-card'));
  numProducts = originalProducts.length;
  
  if (numProducts === 0) {
      console.error('No products found');
      return;
  }
  
  // Calculate initial values
  const itemsPerView = calculateItemsPerView();
  logicalTotalSlides = Math.ceil(numProducts / itemsPerView);
  slideWidth = sliderContainer.offsetWidth;
  
  // Setup carousel
  setupRows();
  createDots();
  
  // Set initial position
  if (settings.infinite) {
      currentSlide = 1;
      setPosition(-slideWidth);
  }
  
  // Setup all event listeners
  setupEventListeners(container);
  
  // Start autoplay if enabled
  if (settings.autoplay) {
      startAutoplay();
  }
}
