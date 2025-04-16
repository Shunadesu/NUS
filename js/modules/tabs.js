/**
 * Tabs module - Handles product tab functionality (description, details, reviews, etc.)
 */

/**
 * Initialize all tabs functionality
 */
export function initTabs() {
    // Initialize product tab navigation
    initTabNavigation();
    
    // Check for hash in URL to activate specific tab on page load
    handleUrlHash();
    
    // Initialize terms link if exists
    initTermsLink();
  }
  
  /**
   * Sets up tab navigation functionality
   */
  function initTabNavigation() {
    // Get all tab buttons and content panes
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!tabButtons.length || !tabPanes.length) return;
    
    // Add click event listeners to each tab button
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Prevent default behavior that causes page to scroll to top
        e.preventDefault();
        
        // Get the tab to activate
        const tabToActivate = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        document.getElementById(tabToActivate)?.classList.add('active');
        
        // Update URL without scrolling (using pushState instead of location.hash)
        if (history.pushState) {
          history.pushState(null, null, '#' + tabToActivate);
        } else {
          // Fallback for older browsers
          window.location.hash = tabToActivate;
          // Immediately scroll back to current position
          setTimeout(() => {
            window.scrollTo(window.scrollX, window.scrollY);
          }, 0);
        }
      });
    });
  }
  
  /**
   * Check for hash in URL to activate specific tab on page load
   */
  function handleUrlHash() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) return;
    
    const tabToActivate = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    
    if (tabToActivate) {
      // Trigger click without scrolling
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      tabToActivate.dispatchEvent(event);
    }
  }
  
  /**
   * Initialize terms link functionality
   */
  function initTermsLink() {
    const termsLink = document.querySelector('.terms-link');
    
    if (!termsLink) return;
    
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      // This would typically open a modal or navigate to terms page
      alert('Terms & Conditions would open here');
    });
  }