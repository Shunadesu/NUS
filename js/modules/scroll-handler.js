const ScrollHandler = {
  heroImage: null,
  heroSection: null,
  heroOffset: 0,
  heroHeight: 0,
  ticking: false,

  init() {
    this.heroImage = document.querySelector('.hero-banner-fixed__image');
    this.heroSection = document.querySelector('.hero-banner-fixed');
    
    if (!this.heroImage || !this.heroSection) return;

    this.heroOffset = this.heroSection.offsetTop;
    this.heroHeight = this.heroSection.offsetHeight;

    this.bindEvents();
    this.updateHeroFixed();
  },

  bindEvents() {
    // Handle scroll event with throttling
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateHeroFixed();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Update measurements on resize
    window.addEventListener('resize', () => {
      this.heroOffset = this.heroSection.offsetTop;
      this.heroHeight = this.heroSection.offsetHeight;
    });
  },

  updateHeroFixed() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if we've scrolled to the hero section
    if (scrollPosition >= this.heroOffset && scrollPosition < (this.heroOffset + this.heroHeight)) {
      this.heroImage.classList.add('fixed');
    } else {
      this.heroImage.classList.remove('fixed');
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ScrollHandler.init();
});

// Export for module usage
export default ScrollHandler; 