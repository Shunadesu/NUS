// pagination.js - Handles the pagination functionality

export function initPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    const prevButton = document.querySelector('.pagination__btn--prev');
    const nextButton = document.querySelector('.pagination__btn--next');
    
    if (!prevButton || !nextButton) return;
    
    let currentPage = 1;
    let totalPages = 3;           // Initial number of pages displayed
    const maxPages = 10;          // Maximum number of pages that can be added
    
    // Create a page button
    function createPageButton(pageNumber) {
      const btn = document.createElement('button');
      btn.className = 'pagination__btn';
      btn.textContent = pageNumber;
    
      btn.addEventListener('click', function () {
        currentPage = pageNumber;
        activatePage(currentPage);
    
        if (currentPage === totalPages && totalPages < maxPages) {
          totalPages++;
          const newBtn = createPageButton(totalPages);
          paginationContainer.insertBefore(newBtn, nextButton);
        }
      });
    
      return btn;
    }
    
    // Activate the current page
    function activatePage(pageNumber) {
      document.querySelectorAll('.pagination__btn').forEach(btn => {
        if (!btn.classList.contains('pagination__btn--prev') && !btn.classList.contains('pagination__btn--next')) {
          btn.classList.toggle('pagination__btn--active', parseInt(btn.textContent) === pageNumber);
        }
      });
    
      prevButton.disabled = pageNumber === 1;
      nextButton.disabled = (pageNumber === maxPages);
      console.log(`Currently on page ${pageNumber}`);
    }
    
    // Previous button click handler
    prevButton.addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        activatePage(currentPage);
      }
    });
    
    // Next button click handler
    nextButton.addEventListener('click', function () {
      if (currentPage < maxPages) {
        currentPage++;
        activatePage(currentPage);
    
        if (currentPage === totalPages && totalPages < maxPages) {
          totalPages++;
          const newBtn = createPageButton(totalPages);
          paginationContainer.insertBefore(newBtn, nextButton);
        }
      }
    });
    
    // Initialize pagination
    for (let i = 1; i <= totalPages; i++) {
      const btn = createPageButton(i);
      if (i === currentPage) btn.classList.add('pagination__btn--active');
      paginationContainer.insertBefore(btn, nextButton);
    }
  }