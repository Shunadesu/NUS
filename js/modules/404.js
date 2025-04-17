/**
 * 404 Page Module - Handles 404 page functionality
 */

/**
 * Initialize 404 page functionality
 */
export function init404Page() {
    // Track 404 error in analytics (if you have analytics)
    trackPageNotFound();
    
    // Focus search input for better UX
    focusSearchInput();
    
    // Initialize animated elements
    initAnimations();
  }
  
  /**
   * Track 404 errors for analytics purposes
   */
  function trackPageNotFound() {
    // Get the URL that led to the 404
    const referringURL = document.referrer;
    const currentPath = window.location.pathname;
    
    // Log for debugging or send to analytics
    console.log('404 Error - Page not found:', {
      path: currentPath,
      referrer: referringURL
    });
    
    // If you have analytics (like Google Analytics), you could track it:
    /*
    if (typeof gtag === 'function') {
      gtag('event', '404_error', {
        'page_path': currentPath,
        'referring_url': referringURL
      });
    }
    */
  }
  
  /**
   * Focus the search input for better user experience
   */
  function focusSearchInput() {
    // Focus the search input after a short delay
    setTimeout(() => {
      const searchInput = document.querySelector('.search-input-group input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 1000);
  }
  
  /**
   * Initialize additional animations
   */
  function initAnimations() {
    // Add any additional animations or interactive elements here
    animateErrorText();
  }
  
  /**
   * Animate the error text for visual interest
   */
  function animateErrorText() {
    const errorTitle = document.querySelector('.error-title');
    if (!errorTitle) return;
    
    // Add a subtle entrance animation
    errorTitle.style.opacity = '0';
    errorTitle.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      errorTitle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      errorTitle.style.opacity = '1';
      errorTitle.style.transform = 'translateY(0)';
    }, 300);
  }
  
  // Export the initialization function
  export default init404Page;