export function createBaseSlider(container, options = {}) {
  const state = {
    currentIndex: 0,
    isAnimating: false,
    touchStartX: 0,
    touchEndX: 0,
    autoplayInterval: null
  };

  const elements = {
    track: container.querySelector(options.trackSelector || '.slider-track'),
    slides: Array.from(container.querySelectorAll(options.slideSelector || '.slide')),
    prevBtn: container.querySelector(options.prevBtnSelector || '.slider-prev'),
    nextBtn: container.querySelector(options.nextBtnSelector || '.slider-next'),
    indicators: Array.from(container.querySelectorAll(options.indicatorSelector || '.indicator'))
  };

  const config = {
    autoplay: true,
    autoplayInterval: 5000,
    transitionDuration: 500,
    onSlideChange: null,
    ...options
  };

  function updateSlidePositions() {
    elements.slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - state.currentIndex)}%)`;
    });
  }

  function updateIndicators() {
    elements.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === state.currentIndex);
      indicator.setAttribute('aria-selected', index === state.currentIndex);
    });
  }

  function slideTo(index) {
    if (state.isAnimating) return;

    // Handle wrap-around
    if (index < 0) index = elements.slides.length - 1;
    if (index >= elements.slides.length) index = 0;

    state.isAnimating = true;
    state.currentIndex = index;

    elements.slides.forEach((slide, i) => {
      slide.style.transition = `transform ${config.transitionDuration}ms ease-in-out`;
      slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });

    updateIndicators();

    // Call onSlideChange callback if provided
    if (config.onSlideChange) {
      config.onSlideChange(index);
    }

    setTimeout(() => {
      state.isAnimating = false;
    }, config.transitionDuration);
  }

  function handleTouchStart(e) {
    state.touchStartX = e.touches[0].clientX;
    pauseAutoplay();
  }

  function handleTouchMove(e) {
    if (!state.touchStartX) return;

    state.touchEndX = e.touches[0].clientX;
    const diff = state.touchStartX - state.touchEndX;

    elements.slides.forEach((slide, index) => {
      const position = 100 * (index - state.currentIndex);
      slide.style.transition = 'none';
      slide.style.transform = `translateX(${position - diff}%)`;
    });
  }

  function handleTouchEnd() {
    if (!state.touchStartX || !state.touchEndX) return;

    const diff = state.touchStartX - state.touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        slideTo(state.currentIndex + 1);
      } else {
        slideTo(state.currentIndex - 1);
      }
    } else {
      slideTo(state.currentIndex);
    }

    state.touchStartX = 0;
    state.touchEndX = 0;
    startAutoplay();
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        slideTo(state.currentIndex - 1);
        break;
      case 'ArrowRight':
        slideTo(state.currentIndex + 1);
        break;
      case 'Home':
        slideTo(0);
        break;
      case 'End':
        slideTo(elements.slides.length - 1);
        break;
    }
  }

  function handleResize() {
    updateSlidePositions();
  }

  function startAutoplay() {
    if (!config.autoplay) return;
    state.autoplayInterval = setInterval(() => {
      slideTo(state.currentIndex + 1);
    }, config.autoplayInterval);
  }

  function pauseAutoplay() {
    clearInterval(state.autoplayInterval);
  }

  function addEventListeners() {
    if (elements.prevBtn) {
      elements.prevBtn.addEventListener('click', () => slideTo(state.currentIndex - 1));
    }
    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', () => slideTo(state.currentIndex + 1));
    }

    elements.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => slideTo(index));
    });

    if (elements.track) {
      elements.track.addEventListener('touchstart', handleTouchStart);
      elements.track.addEventListener('touchmove', handleTouchMove);
      elements.track.addEventListener('touchend', handleTouchEnd);
    }

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('mouseenter', pauseAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    window.addEventListener('resize', handleResize);
  }

  function init() {
    updateSlidePositions();
    addEventListeners();
    if (config.autoplay) {
      startAutoplay();
    }
  }

  // Initialize the slider
  init();

  // Return public methods
  return {
    slideTo,
    startAutoplay,
    pauseAutoplay
  };
} 