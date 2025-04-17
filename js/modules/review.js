/**
 * Reviews module - Handles product reviews functionality
 */

/**
 * Initialize all reviews functionality
 */
export function initReviews() {
    // Initialize reviews dropdown
    initReviewsDropdown();
    
    // Initialize review form
    initReviewForm();
    
    // Initialize star rating
    initStarRating();
  }
  
  /**
   * Initialize reviews dropdown functionality for sorting
   */
  function initReviewsDropdown() {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    
    if (!dropdownBtn) return;
    
    // Dropdown toggle
    dropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownBtn.parentElement.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown) dropdown.classList.remove('active');
      }
    });
    
    // Sort reviews
    const sortOptions = document.querySelectorAll('.dropdown-content a');
    
    if (!sortOptions.length) return;
    
    sortOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update dropdown button text
        const sortText = option.textContent;
        dropdownBtn.innerHTML = sortText + ' <i class="fas fa-chevron-down"></i>';
        
        // Get sort value
        const sortValue = option.getAttribute('data-sort');
        
        // Sort reviews
        sortReviews(sortValue);
        
        // Close dropdown
        document.querySelector('.dropdown').classList.remove('active');
      });
    });
  }
  
  /**
   * Initialize review form functionality
   */
  function initReviewForm() {
    const writeReviewBtn = document.querySelector('.review-btn');
    const reviewForm = document.getElementById('reviewForm');
    const closeFormBtn = document.querySelector('.close-form');
    const submitReviewBtn = document.querySelector('.submit-review');
    
    if (!writeReviewBtn || !reviewForm) return;
    
    // Open review form modal
    writeReviewBtn.addEventListener('click', () => {
      reviewForm.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    // Close review form modal with button
    if (closeFormBtn) {
      closeFormBtn.addEventListener('click', () => {
        reviewForm.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Close modal when clicking outside the form
    reviewForm.addEventListener('click', (e) => {
      if (e.target === reviewForm) {
        reviewForm.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Submit review form
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleReviewSubmission();
      });
    }
  }
  
  /**
   * Handle review form submission
   */
  function handleReviewSubmission() {
    const reviewForm = document.getElementById('reviewForm');
    const ratingStars = document.querySelectorAll('.rating-select i');
    
    // Get form values
    const rating = document.querySelectorAll('.rating-select i.active').length;
    const name = document.getElementById('reviewName')?.value;
    const email = document.getElementById('reviewEmail')?.value;
    const content = document.getElementById('reviewContent')?.value;
    
    // Validate form
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (!name?.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!email?.trim()) {
      alert('Please enter your email');
      return;
    }
    
    if (!content?.trim()) {
      alert('Please enter your review');
      return;
    }
    
    // Here you would typically send the review data to your server
    console.log('Review submitted:', { rating, name, email, content });
    
    // Show success message
    alert('Thank you for your review!');
    
    // Close form and reset fields
    reviewForm.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewEmail').value = '';
    document.getElementById('reviewContent').value = '';
    ratingStars.forEach(s => s.className = 'far fa-star');
  }
  
  /**
   * Initialize star rating functionality
   */
  function initStarRating() {
    const ratingStars = document.querySelectorAll('.rating-select i');
    
    if (!ratingStars.length) return;
    
    ratingStars.forEach(star => {
      // Click event for selecting a rating
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        
        // Reset all stars
        ratingStars.forEach(s => s.className = 'far fa-star');
        
        // Fill stars up to selected rating
        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = 'fas fa-star active';
          }
        });
      });
      
      // Hover effect - mouseover
      star.addEventListener('mouseover', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        
        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = 'fas fa-star';
          } else {
            s.className = 'far fa-star';
          }
        });
      });
      
      // Hover effect - mouseout
      star.addEventListener('mouseout', () => {
        ratingStars.forEach(s => {
          if (s.classList.contains('active')) {
            s.className = 'fas fa-star active';
          } else {
            s.className = 'far fa-star';
          }
        });
      });
    });
  }
  
  /**
   * Function to sort reviews based on different criteria
   * @param {string} sortOption - The option to sort by (recent, highest, lowest)
   */
  export function sortReviews(sortOption) {
    console.log(`Sorting reviews by: ${sortOption}`);
    
    // Get all review items
    const reviewsList = document.querySelector('.reviews-list');
    const reviews = Array.from(document.querySelectorAll('.review-item'));
    
    if (!reviewsList || reviews.length <= 1) return;
    
    // Sort reviews based on selected option
    switch(sortOption) {
      case 'recent':
        // Sort by date (newest first)
        reviews.sort((a, b) => {
          const dateA = new Date(a.querySelector('.review-date')?.textContent || '');
          const dateB = new Date(b.querySelector('.review-date')?.textContent || '');
          return dateB - dateA;
        });
        break;
        
      case 'highest':
        // Sort by rating (highest first)
        reviews.sort((a, b) => {
          const ratingA = a.querySelectorAll('.review-stars .fas.fa-star')?.length || 0;
          const ratingB = b.querySelectorAll('.review-stars .fas.fa-star')?.length || 0;
          return ratingB - ratingA;
        });
        break;
        
      case 'lowest':
        // Sort by rating (lowest first)
        reviews.sort((a, b) => {
          const ratingA = a.querySelectorAll('.review-stars .fas.fa-star')?.length || 0;
          const ratingB = b.querySelectorAll('.review-stars .fas.fa-star')?.length || 0;
          return ratingA - ratingB;
        });
        break;
    }
    
    // Clear the reviews list
    reviewsList.innerHTML = '';
    
    // Append sorted reviews
    reviews.forEach(review => {
      reviewsList.appendChild(review);
    });
  }