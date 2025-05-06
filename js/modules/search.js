// Search functionality
export function setupSearch() {
    const searchBtn = document.querySelector('.icon-btn.search');
    const searchPopup = document.getElementById('searchPopup');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchBtn || !searchPopup) return;
    
    // Remove duplicate event listeners
    const cleanupOldListeners = () => {
      const newSearchBtn = searchBtn.cloneNode(true);
      searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
      return newSearchBtn;
    };
    
    const newSearchBtn = cleanupOldListeners();
    
    // Handle click on search button
    newSearchBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const isActive = this.classList.toggle('active');
      searchPopup.style.display = isActive ? 'block' : 'none';
      
      if (isActive && searchInput) {
        searchInput.classList.display = 'block';
        searchInput.focus();
      }
    });

    // Handle click on search input to prevent closing
    searchInput.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Unified document click handler for closing popups
    if (!window.popupCloseHandlerAdded) {
      document.addEventListener('click', function(e) {
        const activeSearchBtn = document.querySelector('.icon-btn.search.active');
        const activeHelpBtn = document.querySelector('.icon-btn.help-icon.active');
        
        if (activeSearchBtn && searchPopup && 
            !activeSearchBtn.contains(e.target) && 
            !searchPopup.contains(e.target)) {
          activeSearchBtn.classList.remove('active');
          searchPopup.style.display = 'none';
        }
        
        const helpPopup = document.getElementById('helpPopup');
        if (activeHelpBtn && helpPopup && 
            !activeHelpBtn.contains(e.target) && 
            !helpPopup.contains(e.target)) {
          activeHelpBtn.classList.remove('active');
          helpPopup.style.display = 'none';
        }
      });
      
      window.popupCloseHandlerAdded = true;
    }
    
    // Search input handler
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
          submitSearch(this.value);
          e.preventDefault();
        }
      });
    }
  }
  
  // Common search submission function
 export function submitSearch(query) {
    console.log('Searching for:', query);
    // Add your search submission logic here
    // window.location.href = '/search?q=' + encodeURIComponent(query);
  }