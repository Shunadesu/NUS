// Hero slider functionality
export function setupHeroSlider() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const slides = heroSection.querySelectorAll('.hero-slide');
    const dots = heroSection.querySelectorAll('.hero-dot');
    const prevBtn = heroSection.querySelector('.hero-prev-btn');
    const nextBtn = heroSection.querySelector('.hero-next-btn');
    
    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000;
    
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      
      currentSlide = index;
    };
    
    const nextSlide = () => {
      const newIndex = (currentSlide + 1) % slides.length;
      showSlide(newIndex);
    };
    
    const prevSlide = () => {
      const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(newIndex);
    };
    
    const startAutoPlay = () => {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    };
    
    const resetAutoPlay = () => {
      clearInterval(slideInterval);
      startAutoPlay();
    };
    
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
      }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      
      const swipeThreshold = 50;
      if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
        resetAutoPlay();
      } else if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
        resetAutoPlay();
      }
    }, { passive: true });
    
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', startAutoPlay);
    
    window.heroSlider = {
      next: nextSlide,
      prev: prevSlide,
      goTo: (index) => {
        showSlide(index);
        resetAutoPlay();
      },
      create: (slidesData) => console.log('Creating slider with data:', slidesData)
    };
    
    startAutoPlay();
  }