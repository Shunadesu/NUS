// Fixed and optimized script.js


// Remove loader when page is fully loaded
window.addEventListener('load', function() {
  document.getElementById('page-loader').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const header = document.querySelector('.header');
    const headerBg = document.querySelector('.header__bg');
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar__item[data-category]');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const megaMenu = document.querySelector('.mega-menu');
    const megaMenuColumns = document.querySelectorAll('.mega-menu__column');
    const productImages = document.querySelectorAll('.product-image img');
    
    // Check if elements exist before proceeding
    if (!header || !headerBg || !sidebar || !megaMenu) {
      console.warn('Essential elements missing from the DOM');
      return;
    }
    
    // State variables
    let activeCategory = null;
    let hoverTimeout = null;
    
    // Debug function - uncomment to help troubleshoot
    const debug = (message) => {
      console.log(`[Debug] ${message}`);
    };
    
    // Functions
    const showMenu = (category) => {
      debug(`Showing menu for: ${category}`);
      
      // Cancel any pending hide operation
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Skip if already showing this category
      if (activeCategory === category) return;
      
      // Update state
      activeCategory = category;
      
      // Update UI classes - First animation frame
      requestAnimationFrame(() => {
        // Add active classes
        header.classList.add('menu-active');
        
        // Header background animation - slides from top
        headerBg.classList.remove('slide-up');
        headerBg.classList.add('active');
        
        // Mega menu preparation - remove previous animation classes
        megaMenu.classList.remove('slide-down');
        
        // Force reflow before adding animation classes
        void headerBg.offsetWidth;
        void megaMenu.offsetWidth;
        
        // Add animation classes in next frame for smooth transition
        requestAnimationFrame(() => {
          // Header slides down from top
          headerBg.classList.add('slide-down');
          
          // Mega menu slides up from bottom
          megaMenu.classList.add('active');
          megaMenu.classList.add('slide-up');
        });
        
        // Update active link
        sidebarLinks.forEach(link => {
          const parentItem = link.closest('.sidebar__item');
          if (parentItem && parentItem.dataset.category === category) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Show correct mega menu column with staggered animation
        megaMenuColumns.forEach(column => {
          const isActive = column.dataset.category === category;
          column.classList.toggle('active', isActive);
          
          if (isActive) {
            // Animate menu items with staggered delay
            const columnItems = column.querySelectorAll('.column-item');
            columnItems.forEach((item, index) => {
              // Remove existing animation classes
              item.classList.remove('fade-in');
              
              // Force reflow to restart animation
              void item.offsetWidth;
              
              // Add animation with staggered delay
              setTimeout(() => {
                item.classList.add('fade-in');
              }, 150 + (index * 30)); // Delayed start to match mega menu slide
            });
          }
        });
      });
    };
    
    const hideMenu = () => {
      debug('Hiding menu');
      
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      // Set timeout to hide menu (allows for move between sidebar and menu)
      hoverTimeout = setTimeout(() => {
        // Skip if already hidden
        if (!activeCategory) return;
        
        // Update state
        activeCategory = null;
        
        // Update UI classes
        header.classList.remove('menu-active');
        
        // Start animations - using requestAnimationFrame for synchronization
        requestAnimationFrame(() => {
          // Header slides up
          headerBg.classList.remove('slide-down');
          headerBg.classList.add('slide-up');
          
          // Mega menu slides down - with quick exit
          megaMenu.classList.remove('slide-up');
          megaMenu.classList.add('slide-down');
          
          // Set display none much faster for mega menu
          setTimeout(() => {
            // Hide mega menu quickly
            megaMenu.classList.remove('active');
            megaMenu.classList.remove('slide-down');
          }, 150); // Much faster than the header animation (half time)
          
          // Delay removing active classes for header until animation completes
          setTimeout(() => {
            headerBg.classList.remove('active');
            headerBg.classList.remove('slide-up');
          }, 300); // Normal time for header transition
        });
        
        // Remove active state from all links
        sidebarLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Reset animations
        document.querySelectorAll('.column-item').forEach(item => {
          item.classList.remove('fade-in');
        });
      }, 100); // Reduced delay for faster responsiveness
    };
    
    // Set up event listeners
    const setupEventListeners = () => {
      debug('Setting up event listeners');
      
      // Event listeners for sidebar items - reinitiate animation even if already active
      sidebarItems.forEach(item => {
        if (!item) return;
        
        const category = item.dataset.category;
        if (!category) return;
        
        item.addEventListener('mouseenter', () => {
          debug(`Mouse enter on: ${category}`);
          
          // Add hover state class
          header.classList.add('sidebar-hover');
          
          // Important - always force a new animation cycle
          // First remove any existing animation classes from mega menu
          megaMenu.classList.remove('active', 'slide-up', 'slide-down');
          
          // Force reflow to ensure new animation starts fresh
          void megaMenu.offsetWidth;
          
          // For any active category, we need to reset it completely
          if (activeCategory) {
            // If switching between categories, force a quick reset
            if (activeCategory !== category) {
              // Hide all columns immediately 
              megaMenuColumns.forEach(column => {
                column.classList.remove('active');
              });
              
              // Force reflow before showing new category
              void megaMenu.offsetWidth;
            }
          }
          
          // Show the new category with animation
          showMenu(category);
        });
      });
      
      // Event for sidebar mouse leave
      sidebar.addEventListener('mouseleave', () => {
        debug('Mouse leave sidebar');
        
        if (!header.classList.contains('menu-active')) {
          header.classList.remove('sidebar-hover');
        }
        hideMenu();
      });
      
      // Events for mega menu
      megaMenu.addEventListener('mouseenter', () => {
        debug('Mouse enter mega menu');
        // Clear any pending hide timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
      });
      
      megaMenu.addEventListener('mouseleave', () => {
        debug('Mouse leave mega menu');
        hideMenu();
      });
    };
    
    // Product image hover effects
    const setupProductImages = () => {
      if (!productImages.length) return;
      
      productImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
          img.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', () => {
          img.style.transform = '';
        });
      });
    };
    
    // Purchase notification functionality
    const setupPurchaseNotification = () => {
      const notification = document.getElementById('purchase-notification');
      const closeBtn = document.getElementById('notification-close');
      
      if (!notification || !closeBtn) return;
      
      let notificationTimer;
      
      const showNotification = () => {
        // Use class for animation instead of display property
        notification.classList.add('active');
        
        // Auto-hide after 5 seconds
        clearTimeout(notificationTimer);
        notificationTimer = setTimeout(() => {
          notification.classList.remove('active');
          
          // Show again after 5 seconds
          notificationTimer = setTimeout(showNotification, 5000);
        }, 5000);
      };
      
      // Close button handler
      closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        clearTimeout(notificationTimer);
        
        // Show again after 5 seconds
        notificationTimer = setTimeout(showNotification, 5000);
      });
      
      // Start the cycle
      setTimeout(showNotification, 1000);
    };
    
    // Pagination functionality
    const setupPagination = () => {
      const prevBtn = document.querySelector('.pagination-btn.prev');
      const nextBtn = document.querySelector('.pagination-btn.next');
      const paginationText = document.querySelector('.pagination-text');
      
      if (!prevBtn || !nextBtn || !paginationText) return;
      
      let currentPage = 1;
      const totalPages = 2;
      
      const updatePagination = () => {
        paginationText.textContent = `${currentPage}/${totalPages}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      };
      
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          updatePagination();
        }
      });
      
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          updatePagination();
        }
      });
      
      // Initialize pagination
      updatePagination();
    };
    
    // Page loader
    const setupPageLoader = () => {
      const loader = document.querySelector('.loading');
      if (!loader) return;
      
      window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 300);
      });
    };
    
    // Initialize all components
    setupEventListeners();
    setupProductImages();
    setupPurchaseNotification();
    setupPagination();
    setupPageLoader();
    
    // Debug initialization status
    debug('Initialization complete');
});

document.addEventListener('DOMContentLoaded', function() {
  // Set up the infinite scrolling top bar
  const setupScrollingTopBar = () => {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    
    // Create the scroll container if it doesn't exist yet
    if (!document.querySelector('.top-bar__scroll-container')) {
      // Get the original content
      const originalContent = topBar.innerHTML;
      
      // Create new structure with duplicated content
      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'top-bar__scroll-container';
      
      // Create first content section
      const content1 = document.createElement('div');
      content1.className = 'top-bar__content';
      content1.innerHTML = originalContent;
      
      // Create duplicate content section
      const content2 = document.createElement('div');
      content2.className = 'top-bar__content';
      content2.innerHTML = originalContent;
      
      // Assemble the structure
      scrollContainer.appendChild(content1);
      scrollContainer.appendChild(content2);
      
      // Replace the top bar content
      topBar.innerHTML = '';
      topBar.appendChild(scrollContainer);
    }
    
    // Optional: Add dynamic speed adjustment based on content length
    const adjustScrollSpeed = () => {
      const container = document.querySelector('.top-bar__scroll-container');
      const content = document.querySelector('.top-bar__content');
      
      if (container && content) {
        // Get content width to determine appropriate speed
        const contentWidth = content.offsetWidth;
        const viewportWidth = window.innerWidth;
        
        // Adjust animation duration based on content width
        // Longer content should scroll slower for readability
        const baseDuration = 20; // Base duration in seconds
        const calculatedDuration = baseDuration * (contentWidth / viewportWidth);
        const duration = Math.max(15, Math.min(calculatedDuration, 40)); // Between 15-40s
        
        // Apply the calculated duration
        container.style.animationDuration = `${duration}s`;
      }
    };
    
    // Run once on load and then on resize
    adjustScrollSpeed();
    window.addEventListener('resize', adjustScrollSpeed);
  };
  
  // Initialize
  setupScrollingTopBar();
});

// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Get DOM elements
  const slides = heroSection.querySelectorAll('.hero-slide');
  const dots = heroSection.querySelectorAll('.hero-dot');
  const prevBtn = heroSection.querySelector('.hero-prev-btn');
  const nextBtn = heroSection.querySelector('.hero-next-btn');

  // State
  let currentSlide = 0;
  let slideInterval;
  const autoPlayDelay = 5000; // 5 seconds between slides

  // Functions
  const showSlide = (index) => {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Deactivate all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    // Show the current slide and activate its dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    // Set current slide index
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

  const goToSlide = (index) => {
    showSlide(index);
    // Reset the auto-play timer whenever a slide is manually changed
    resetAutoPlay();
  };

  const startAutoPlay = () => {
    // Clear any existing interval first
    if (slideInterval) {
      clearInterval(slideInterval);
    }
    // Set up auto play
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  };

  const resetAutoPlay = () => {
    clearInterval(slideInterval);
    startAutoPlay();
  };

  // Set up event listeners
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
      goToSlide(index);
    });
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    }
  });

  // Handle swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum distance required for a swipe
    
    // If swipe distance exceeds threshold
    if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right to left (show previous)
      prevSlide();
      resetAutoPlay();
    } else if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left to right (show next)
      nextSlide();
      resetAutoPlay();
    }
  };

  // Pause auto play when mouse is over the hero section
  heroSection.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });

  heroSection.addEventListener('mouseleave', () => {
    startAutoPlay();
  });

  // Data API - can be used with data attributes to create dynamic content
  const createHeroSlider = (slidesData) => {
    // This function could be expanded to dynamically generate slides from data
    // Similar to how your React component handles the slides array
    console.log('Creating slider with data:', slidesData);
  };

  // Expose the API
  window.heroSlider = {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    create: createHeroSlider
  };

  // Initialize auto play
  startAutoPlay();
});


function toggleSearchInput() {
  const searchText = document.querySelector('.search-text');
  const searchInput = document.querySelector('.search-input');
  
  // Toggle between text and input
  if (searchInput.style.display === 'none') {
    // Hide text, show input
    searchText.style.display = 'none';
    searchInput.style.display = 'inline-block';
    searchInput.focus();
    
    // Prevent the event from bubbling up and immediately hiding the input
    event.stopPropagation();
    
    // Add click outside handler to revert back to text when clicking elsewhere
    document.addEventListener('click', revertToSearchText);
  } else {
    // If input has value, submit the search
    if (searchInput.value.trim() !== '') {
      submitSearch(searchInput.value);
    }
  }
}


function submitSearch(query) {
  console.log('Searching for:', query);
  // Add your search submission logic here
  // e.g., window.location.href = '/search?q=' + encodeURIComponent(query);
}
function toggleSearch() {
  const button = document.querySelector('.icon-btn.search');
  const popup = document.getElementById('searchPopup');
  const searchInput = document.querySelector('.search-input');

  if (!popup || !button || !searchInput) {
    return;
  }

  // Toggle popup display
  const isActive = button.classList.toggle('active');
  popup.style.display = isActive ? 'block' : 'none';

  // Focus input if active
  if (isActive) {
    searchInput.focus();
  }

  // Set up outside click listener only once
  document.addEventListener('click', handleOutsideClick);
  
  function handleOutsideClick(e) {
    if (!popup.contains(e.target) && !button.contains(e.target)) {
      popup.style.display = 'none';
      button.classList.remove('active');
      document.removeEventListener('click', handleOutsideClick);
    }
  }
}

function toggleHelp(){
  const button = document.querySelector('.icon-btn.help-icon');
  const popup = document.getElementById('helpPopup');
  if (!popup || !button) {
    return;
  }

   // Toggle popup display
   const isActive = button.classList.toggle('active');
   popup.style.display = isActive ? 'block' : 'none';

   document.addEventListener('click', handleOutsideClick);
  
  function handleOutsideClick(e) {
    if (!popup.contains(e.target) && !button.contains(e.target)) {
      popup.style.display = 'none';
      button.classList.remove('active');
      document.removeEventListener('click', handleOutsideClick);
    }
  }
}

// Add event listener for Enter key on the search input
document.querySelector('.search-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && this.value.trim() !== '') {
    submitSearch(this.value);
    e.preventDefault(); // Prevent form submission if within a form
  }
});

// Close search popup when clicking outside
document.addEventListener('click', function(event) {
  const searchBtn = document.querySelector('.search');
  const popup = document.getElementById('searchPopup');
  
  if (!searchBtn.contains(event.target) && event.target !== popup && !popup.contains(event.target)) {
    popup.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const recentlyViewed = document.querySelector('.recently-viewed');
  const floatingBtn = document.querySelector('.floating-buttons');
  const externalLink = document.querySelector('.external-link');

  const toggleBtn = recentlyViewed.querySelector('.tab-toggle');

  externalLink.addEventListener('click', () => {
    recentlyViewed.classList.toggle('close');
    floatingBtn.classList.toggle('open');
  });

  toggleBtn.addEventListener('click', () => {
    recentlyViewed.classList.toggle('close');
    floatingBtn.classList.toggle('open');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.querySelector('.scroll-top');

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Color selection functionality
  const colorOptions = document.querySelectorAll('.color-option');
  const productColorText = document.querySelector('.product-color');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Update the color text
      const colorName = this.getAttribute('data-color');
      productColorText.textContent = colorName;
    });
  });
  
  // Navigation buttons functionality
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  
  // For demonstration purposes - in a real implementation, 
  // these would navigate through actual products
  prevButton.addEventListener('click', function() {
    console.log('Previous product clicked');
    // Here you would implement logic to show the previous product
  });
  
  nextButton.addEventListener('click', function() {
    console.log('Next product clicked');
    // Here you would implement logic to show the next product
  });
  
  // Details button functionality
  const detailsButton = document.querySelector('.details-button');
  
  detailsButton.addEventListener('click', function() {
    console.log('Details button clicked');
    // Here you would implement logic to show more product details
    // For example, open a modal or expand a section
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const modal = document.getElementById('customerServiceModal');
  const openButton = document.getElementById('openCustomerService');
  const closeButton = document.getElementById('closeModal');
  
  // Function to open the modal
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  // Function to close the modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Event listeners
  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  
  // Close modal when clicking outside the modal content
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Prevent event propagation for links
  const links = document.querySelectorAll('.modal-content a');
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Link clicked:', this.textContent);
      // In a real application, you would handle the link action here
    });
  });
  
  // Handle send message click
  const sendMessageLink = document.querySelector('.send-message');
  if (sendMessageLink) {
    sendMessageLink.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Opening message form...');
      // In a real application, you would show a message form here
      alert('Message form would open here');
    });
  }
});