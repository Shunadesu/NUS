import { createBaseSlider } from './base-slider.js';

export function createTestimonialSlider(container, options = {}) {
  const elements = {
    slides: Array.from(container.querySelectorAll('.testimonial-slide')),
    prevBtn: container.querySelector('.testimonial-prev'),
    nextBtn: container.querySelector('.testimonial-next')
  };

  let currentIndex = 0;
  let isAnimating = false;
  let autoplayTimer = null;
  const slideCount = elements.slides.length;

  function getNextIndex(current, direction = 1) {
    return (current + direction + slideCount) % slideCount;
  }

  function updateSlideClasses(newIndex) {
    elements.slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      
      if (i === newIndex) {
        slide.classList.add('active');
      } else if (i === currentIndex) {
        slide.classList.add(newIndex > currentIndex ? 'prev' : 'next');
      } else {
        slide.classList.add(i < newIndex ? 'prev' : 'next');
      }
    });
  }

  function slide(direction = 1) {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex = getNextIndex(currentIndex, direction);
    updateSlideClasses(nextIndex);
    currentIndex = nextIndex;

    // Reset animation flag after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 600); // Match transition duration from CSS
  }

  function next() {
    slide(1);
  }

  function prev() {
    slide(-1);
  }

  function startAutoplay() {
    stopAutoplay();
    if (options.autoplay !== false) {
      autoplayTimer = setInterval(next, options.autoplayInterval || 5000);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Touch handling
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (!touchStartX || !touchEndX) return;
    
    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX = 0;
    touchEndX = 0;
    startAutoplay();
  }

  // Event listeners
  if (elements.prevBtn) {
    elements.prevBtn.addEventListener('click', () => {
      prev();
      stopAutoplay();
    });
  }

  if (elements.nextBtn) {
    elements.nextBtn.addEventListener('click', () => {
      next();
      stopAutoplay();
    });
  }

  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: true });
  container.addEventListener('touchend', handleTouchEnd);
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Initialize
  elements.slides[0].classList.add('active');
  elements.slides.slice(1).forEach(slide => slide.classList.add('next'));
  startAutoplay();

  // Return public methods
  return {
    next,
    prev,
    startAutoplay,
    stopAutoplay
  };
}