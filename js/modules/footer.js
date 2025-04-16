/**
 * Footer Component JavaScript Functionality
 * Handles language/currency selectors and newsletter submission
 */
  
export function initFooterFunctionality() {
    // Initialize Language Selector
    initLanguageSelector();
    
    // Initialize Currency Selector
    initCurrencySelector();
    
    // Initialize Newsletter Form
    initNewsletterForm();
    
    // Initialize Social Links Tracking
    initSocialLinks();
  }
  
  /**
   * Language Selector Functionality
   */
  function initLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    
    if (!languageSelector) return;
    
    // Set initial value from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    languageSelector.value = savedLanguage;
    
    // Add change event listener
    languageSelector.addEventListener('change', function() {
      const selectedLanguage = this.value;
      
      // Save to localStorage
      localStorage.setItem('selectedLanguage', selectedLanguage);
      
      // Show loading indicator or feedback
      showFeedback('Language changed to ' + getLanguageName(selectedLanguage));
      
      // In a real application, you might reload the page or fetch new content
      console.log('Language changed to:', selectedLanguage);
    });
  }
  
  /**
   * Currency Selector Functionality
   */
  function initCurrencySelector() {
    const currencySelector = document.getElementById('currencySelector');
    
    if (!currencySelector) return;
    
    // Set initial value from localStorage or default to 'USD'
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    currencySelector.value = savedCurrency;
    
    // Add change event listener
    currencySelector.addEventListener('change', function() {
      const selectedCurrency = this.value;
      
      // Save to localStorage
      localStorage.setItem('selectedCurrency', selectedCurrency);
      
      // Show feedback
      showFeedback('Currency changed to ' + getCurrencyName(selectedCurrency));
      
      // In a real application, you would update prices across the site
      console.log('Currency changed to:', selectedCurrency);
    });
  }
  
  /**
   * Newsletter Form Functionality
   */
  function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        showFeedback('Please enter your email address', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address', 'error');
        return;
      }
      
      // Show loading state
      const subscribeBtn = this.querySelector('button[type="submit"]');
      const originalText = subscribeBtn.textContent;
      subscribeBtn.textContent = 'SENDING...';
      subscribeBtn.disabled = true;
      
      // Simulate API call
      setTimeout(function() {
        // Reset button
        subscribeBtn.textContent = originalText;
        subscribeBtn.disabled = false;
        
        // Clear input
        emailInput.value = '';
        
        // Show success feedback
        showFeedback('Thank you for subscribing to our newsletter!', 'success');
        
        console.log('Newsletter subscription:', email);
      }, 1500);
    });
  }
  
  /**
   * Social Media Links Tracking
   */
  function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.footer__social .social-link');
    
    socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Get the social network name from the icon class or aria-label
        const socialNetwork = this.getAttribute('aria-label');
        
        // Log the click for analytics
        console.log('Social link clicked:', socialNetwork);
      });
    });
  }
  
  /**
   * Helper function to show feedback to users
   * @param {string} message - The message to display
   * @param {string} type - The type of feedback (success, error, info)
   */
  function showFeedback(message, type = 'info') {
    // Check if feedback container exists, if not create it
    let feedbackContainer = document.querySelector('.feedback-container');
    
    if (!feedbackContainer) {
      feedbackContainer = document.createElement('div');
      feedbackContainer.className = 'feedback-container';
      document.body.appendChild(feedbackContainer);
      
      // Add styles to the feedback container
      feedbackContainer.style.position = 'fixed';
      feedbackContainer.style.bottom = '20px';
      feedbackContainer.style.right = '20px';
      feedbackContainer.style.zIndex = '9999';
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback--${type}`;
    feedback.textContent = message;
    
    // Style the feedback
    feedback.style.backgroundColor = type === 'success' ? '#10b981' : 
                                    type === 'error' ? '#ef4444' : '#3b82f6';
    feedback.style.color = 'white';
    feedback.style.padding = '12px 20px';
    feedback.style.borderRadius = '4px';
    feedback.style.marginTop = '10px';
    feedback.style.boxShadow = 'var(--shadow-md)';
    feedback.style.transform = 'translateY(20px)';
    feedback.style.opacity = '0';
    feedback.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Add to container
    feedbackContainer.appendChild(feedback);
    
    // Trigger animation
    setTimeout(() => {
      feedback.style.transform = 'translateY(0)';
      feedback.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      feedback.style.transform = 'translateY(20px)';
      feedback.style.opacity = '0';
      
      // Remove from DOM after animation
      setTimeout(() => {
        feedbackContainer.removeChild(feedback);
      }, 300);
    }, 3000);
  }
  
  /**
   * Helper function to validate email
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Helper function to get language name from code
   * @param {string} code - The language code
   * @returns {string} - The language name
   */
  function getLanguageName(code) {
    const languages = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish'
    };
    
    return languages[code] || code;
  }
  
  /**
   * Helper function to get currency name from code
   * @param {string} code - The currency code
   * @returns {string} - The currency name
   */
  function getCurrencyName(code) {
    const currencies = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound'
    };
    
    return currencies[code] || code;
  }