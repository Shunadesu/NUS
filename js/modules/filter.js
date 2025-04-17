// filters.js - Handles product filtering functionality

/**
 * Initialize all product filter functionality
 */
export function initFilters() {
    // Initialize collapsible filter sections
    initFilterToggles();
    
    // Initialize price range slider
    initPriceSlider();
    
    // Initialize color filters
    initColorFilters();
    
    // Initialize size filters
    initSizeFilters();
  }
  
  /**
   * Handles expanding/collapsing filter sections
   */
  function initFilterToggles() {
    const filterToggles = document.querySelectorAll('.filter__toggle');
    
    if (!filterToggles.length) return;
    
    filterToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const filterContent = this.closest('.filter').querySelector('.filter__content');
        const minusIcon = this.querySelector('.minus');
        
        if (!filterContent || !minusIcon) return;
        
        if (filterContent.style.display === 'none') {
          filterContent.style.display = 'block';
          filterContent.style.maxHeight = '100%';
          minusIcon.textContent = '−';
        } else {
          filterContent.style.display = 'none';
          filterContent.style.maxHeight = '0';
          minusIcon.textContent = '+';
        }
      });
    });
  }
  
  /**
   * Initializes the price range slider
   */
  function initPriceSlider() {
    const priceSlider = document.querySelector('.price-slider');
    if (!priceSlider) return;
    
    const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
    const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
    const range = document.querySelector('.price-slider__range');
    const minPrice = document.querySelector('.price-min');
    const maxPrice = document.querySelector('.price-max');
    
    if (!minThumb || !maxThumb || !range || !minPrice || !maxPrice) return;
    
    let isDragging = false;
    let currentThumb = null;
    let startX = 0;
    let startLeft = 0;
    
    const minValue = 0;
    const maxValue = 200;
    let currentMinValue = minValue;
    let currentMaxValue = maxValue;
    
    /**
     * Updates the price range display and slider positions
     */
    function updatePriceRange() {
      const track = priceSlider.querySelector('.price-slider__track');
      if (!track) return;
      
      const trackWidth = track.offsetWidth;
      
      const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
      const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
      
      minThumb.style.left = `${minPercent}%`;
      maxThumb.style.left = `${maxPercent}%`;
      
      range.style.left = `${minPercent}%`;
      range.style.right = `${100 - maxPercent}%`;
      
      minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
      maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
      
      // Dispatch a custom event for other components to listen for
      const filterChangeEvent = new CustomEvent('priceFilterChange', {
        detail: {
          minPrice: currentMinValue,
          maxPrice: currentMaxValue
        }
      });
      document.dispatchEvent(filterChangeEvent);
    }
    
    /**
     * Starts dragging a thumb
     */
    function startDrag(e, thumb) {
      e.preventDefault();
      isDragging = true;
      currentThumb = thumb;
      
      startX = e.clientX || e.touches[0].clientX;
      startLeft = parseFloat(currentThumb.style.left) || 
                  (currentThumb.dataset.value === 'min' ? 0 : 100);
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    /**
     * Handles dragging movement
     */
    function drag(e) {
      if (!isDragging) return;
      
      const track = priceSlider.querySelector('.price-slider__track');
      if (!track) return;
      
      const trackRect = track.getBoundingClientRect();
      const trackWidth = trackRect.width;
      
      const clientX = e.clientX || e.touches[0].clientX;
      const deltaX = clientX - startX;
      const deltaPercent = (deltaX / trackWidth) * 100;
      let newLeft = startLeft + deltaPercent;
      
      // Constrain to track bounds
      newLeft = Math.max(0, Math.min(100, newLeft));
      
      // Prevent thumbs from crossing
      if (currentThumb.dataset.value === 'min') {
        const maxLeft = parseFloat(maxThumb.style.left) || 100;
        newLeft = Math.min(newLeft, maxLeft - 5);
        currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
      } else {
        const minLeft = parseFloat(minThumb.style.left) || 0;
        newLeft = Math.max(newLeft, minLeft + 5);
        currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
      }
      
      currentThumb.style.left = `${newLeft}%`;
      updatePriceRange();
    }
    
    /**
     * Stops dragging
     */
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
    
    // Add event listeners for thumbs
    minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
    minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
    maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
    maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
    
    // Initialize price slider
    updatePriceRange();
  }
  
  /**
   * Initializes color filter selection
   */
  function initColorFilters() {
    const colorFilters = document.querySelectorAll('.color-filter');
    if (!colorFilters.length) return;
    
    colorFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Toggle selected state
        this.classList.toggle('selected');
        
        // Dispatch filter change event
        dispatchFilterChangeEvent('color');
      });
    });
  }
  
  /**
   * Initializes size filter selection
   */
  function initSizeFilters() {
    const sizeFilters = document.querySelectorAll('.size-filter');
    if (!sizeFilters.length) return;
    
    sizeFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Toggle selected state
        this.classList.toggle('selected');
        
        // Dispatch filter change event
        dispatchFilterChangeEvent('size');
      });
    });
  }
  
  /**
   * Dispatches a custom event when filters change
   * @param {string} filterType - The type of filter that changed
   */
  function dispatchFilterChangeEvent(filterType) {
    // Get all selected filters
    const selectedColors = Array.from(document.querySelectorAll('.color-filter.selected'))
      .map(el => el.getAttribute('data-color') || el.getAttribute('title') || el.textContent.trim());
      
    const selectedSizes = Array.from(document.querySelectorAll('.size-filter.selected'))
      .map(el => el.getAttribute('data-size') || el.textContent.trim());
    
    // Create and dispatch the event
    const filterChangeEvent = new CustomEvent('filterChange', {
      detail: {
        type: filterType,
        colors: selectedColors,
        sizes: selectedSizes
      }
    });
    
    document.dispatchEvent(filterChangeEvent);
  }
  
  /**
   * Applies active filters to product list
   * Can be extended to work with AJAX for server-side filtering
   */
  export function applyFilters() {
    const selectedColors = Array.from(document.querySelectorAll('.color-filter.selected'))
      .map(el => el.getAttribute('data-color') || el.getAttribute('title') || el.textContent.trim());
      
    const selectedSizes = Array.from(document.querySelectorAll('.size-filter.selected'))
      .map(el => el.getAttribute('data-size') || el.textContent.trim());
    
    const minPrice = parseFloat(document.querySelector('.price-min')?.textContent.replace('$', '') || 0);
    const maxPrice = parseFloat(document.querySelector('.price-max')?.textContent.replace('$', '') || 200);
    
    console.log('Applying filters:', {
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: { min: minPrice, max: maxPrice }
    });
    
    // Implementation for filtering products would go here
    // This could be client-side filtering or an AJAX call to the server
    
    // For demo purposes, let's simulate filtering
    document.querySelectorAll('.product-card').forEach(product => {
      const productPrice = parseFloat(product.querySelector('.product-price')?.dataset?.price || 0);
      const productColor = product.getAttribute('data-color') || '';
      const productSize = product.getAttribute('data-size') || '';
      
      let visible = true;
      
      // Price filter
      if (productPrice < minPrice || productPrice > maxPrice) {
        visible = false;
      }
      
      // Color filter (if any selected)
      if (selectedColors.length > 0 && !selectedColors.includes(productColor)) {
        visible = false;
      }
      
      // Size filter (if any selected)
      if (selectedSizes.length > 0 && !selectedSizes.includes(productSize)) {
        visible = false;
      }
      
      // Apply visibility
      product.style.display = visible ? 'block' : 'none';
    });
  }
  
  /**
   * Resets all filters to their default state
   */
  export function resetFilters() {
    // Reset color filters
    document.querySelectorAll('.color-filter.selected').forEach(filter => {
      filter.classList.remove('selected');
    });
    
    // Reset size filters
    document.querySelectorAll('.size-filter.selected').forEach(filter => {
      filter.classList.remove('selected');
    });
    
    // Reset price slider (would need to reinitialize the price slider)
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
      const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
      const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
      const range = document.querySelector('.price-slider__range');
      const minPrice = document.querySelector('.price-min');
      const maxPrice = document.querySelector('.price-max');
      
      if (minThumb && maxThumb && range && minPrice && maxPrice) {
        minThumb.style.left = '0%';
        maxThumb.style.left = '100%';
        range.style.left = '0%';
        range.style.right = '0%';
        minPrice.textContent = '$0.00';
        maxPrice.textContent = '$200.00';
      }
    }
    
    // Apply the reset filters
    applyFilters();
    
    // Dispatch event to notify other components
    const resetEvent = new CustomEvent('filtersReset');
    document.dispatchEvent(resetEvent);
  }