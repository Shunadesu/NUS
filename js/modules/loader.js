// Page loader functionality
export function setupPageLoader() {
    const loader = document.querySelector('.loading');
    if (!loader) return;
    
    // Set a timeout to hide the loader even if the load event doesn't fire
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 300);
    }, 2000);
  }
  
  // Remove loader when the page is fully loaded
  export function handlePageLoad() {
    const loader = document.querySelector('.loading');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 300);
    }
    
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) pageLoader.style.display = 'none';
  }