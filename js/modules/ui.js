// Infinite scrolling top bar
export function setupScrollingTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    
    if (!document.querySelector('.top-bar__scroll-container')) {
      const originalContent = topBar.innerHTML;
      
      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'top-bar__scroll-container';
      
      const content1 = document.createElement('div');
      content1.className = 'top-bar__content';
      content1.innerHTML = originalContent;
      
      const content2 = document.createElement('div');
      content2.className = 'top-bar__content';
      content2.innerHTML = originalContent;
      
      scrollContainer.appendChild(content1);
      scrollContainer.appendChild(content2);
      
      topBar.innerHTML = '';
      topBar.appendChild(scrollContainer);
    }
    
    const adjustScrollSpeed = () => {
      const container = document.querySelector('.top-bar__scroll-container');
      const content = document.querySelector('.top-bar__content');
      
      if (container && content) {
        const contentWidth = content.offsetWidth;
        const viewportWidth = window.innerWidth;
        
        const baseDuration = 20;
        const calculatedDuration = baseDuration * (contentWidth / viewportWidth);
        const duration = Math.max(15, Math.min(calculatedDuration, 40));
        
        container.style.animationDuration = `${duration}s`;
      }
    };
    
    adjustScrollSpeed();
    window.addEventListener('resize', adjustScrollSpeed);
  }
  
  // Help popup functionality
  export function setupHelp() {
    const helpBtn = document.querySelector('.icon-btn.help-icon');
    const helpPopup = document.getElementById('helpPopup');
    
    if (!helpBtn || !helpPopup) return;
    
    helpBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = this.classList.toggle('active');
      helpPopup.style.display = isActive ? 'block' : 'none';
    });
  }
  
  // Recently viewed and floating buttons
  export function setupRecentlyViewed() {
    const recentlyViewed = document.querySelector('.recently-viewed');
    if (!recentlyViewed) return;
    
    const floatingBtn = document.querySelector('.floating-buttons');
    const externalLink = document.querySelector('.external-link');
    const toggleBtn = recentlyViewed.querySelector('.tab-toggle');
    
    if (externalLink) {
      externalLink.addEventListener('click', () => {
        recentlyViewed.classList.toggle('close');
        if (floatingBtn) floatingBtn.classList.toggle('open');
      });
    }
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        recentlyViewed.classList.toggle('close');
        if (floatingBtn) floatingBtn.classList.toggle('open');
      });
    }
  }
  
  // Scroll to top button
  export function setupScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }