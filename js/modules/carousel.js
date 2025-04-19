// // Initialize all carousels
// document.addEventListener('DOMContentLoaded', () => {
//   const carousels = document.querySelectorAll('.carousel-container');
//   carousels.forEach(initCarousel);
// });

// function initCarousel(container) {
//   // Get carousel elements
//   const carousel = container.querySelector('.carousel');
//   const slides = carousel.children;
//   const totalSlides = slides.length;
//   let currentSlide = 0;
  
//   // Get progress bar elements
//   const progressBar = container.querySelector('.carousel-progress');
//   const progressTrack = container.querySelector('.carousel-progress-track');
//   const progressHandle = container.querySelector('.carousel-progress-handle');
  
//   // Get navigation buttons
//   const prevBtn = container.querySelector('.carousel-control.prev');
//   const nextBtn = container.querySelector('.carousel-control.next');

//   // Initialize carousel
//   carousel.style.transform = 'translateX(0)';
//   carousel.style.transition = 'transform 0.3s ease';
  
//   // Update progress bar
//   function updateProgress() {
//     if (!progressTrack || !progressHandle) return;
    
//     const progress = (currentSlide / (totalSlides - 1)) * 100;
    
//     // Smooth transition for progress bar
//     progressTrack.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
//     progressHandle.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
//     progressTrack.style.width = `${progress}%`;
//     progressHandle.style.left = `${progress}%`;
    
//     // Update labels if they exist
//     const startLabel = container.querySelector('.start-label');
//     const endLabel = container.querySelector('.end-label');
//     if (startLabel) startLabel.textContent = currentSlide + 1;
//     if (endLabel) endLabel.textContent = totalSlides;
//   }

//   // Handle progress bar click
//   function handleProgressClick(e) {
//     if (!progressBar) return;
    
//     const rect = progressBar.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const progress = (x / rect.width) * 100;
    
//     const newSlide = Math.round((progress / 100) * (totalSlides - 1));
//     if (newSlide !== currentSlide) {
//       currentSlide = newSlide;
//       updateSlide();
//     }
//   }

//   // Handle progress bar drag
//   let isDragging = false;
//   let startX = 0;
//   let startProgress = 0;
  
//   function startDragging(e) {
//     if (!progressBar || !progressHandle) return;
    
//     e.preventDefault();
//     isDragging = true;
    
//     const rect = progressBar.getBoundingClientRect();
//     startX = e.clientX || e.touches[0].clientX;
//     startProgress = parseFloat(progressHandle.style.left) || 0;
    
//     // Disable transitions during drag
//     carousel.style.transition = 'none';
//     progressTrack.style.transition = 'none';
//     progressHandle.style.transition = 'none';
    
//     // Add event listeners for both mouse and touch
//     document.addEventListener('mousemove', handleDrag);
//     document.addEventListener('mouseup', stopDragging);
//     document.addEventListener('touchmove', handleDrag, { passive: false });
//     document.addEventListener('touchend', stopDragging);
//   }

//   function handleDrag(e) {
//     if (!isDragging || !progressBar) return;
    
//     e.preventDefault();
//     const rect = progressBar.getBoundingClientRect();
//     const currentX = e.clientX || e.touches[0].clientX;
//     const diffX = currentX - startX;
//     const progressDiff = (diffX / rect.width) * 100;
    
//     const newProgress = Math.max(0, Math.min(100, startProgress + progressDiff));
    
//     progressTrack.style.width = `${newProgress}%`;
//     progressHandle.style.left = `${newProgress}%`;
    
//     const slideIndex = Math.round((newProgress / 100) * (totalSlides - 1));
//     const translateX = -(slideIndex * 100);
//     carousel.style.transform = `translateX(${translateX}%)`;
//   }

//   function stopDragging() {
//     if (!isDragging) return;
    
//     isDragging = false;
    
//     // Restore transitions
//     carousel.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
//     progressTrack.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
//     progressHandle.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
//     const currentProgress = parseFloat(progressHandle?.style.left) || 0;
//     currentSlide = Math.round((currentProgress / 100) * (totalSlides - 1));
//     updateSlide();
    
//     // Remove event listeners
//     document.removeEventListener('mousemove', handleDrag);
//     document.removeEventListener('mouseup', stopDragging);
//     document.removeEventListener('touchmove', handleDrag);
//     document.removeEventListener('touchend', stopDragging);
//   }

//   // Update slide position
//   function updateSlide() {
//     currentSlide = Math.max(0, Math.min(currentSlide, totalSlides - 1));
//     const offset = -currentSlide * 100;
//     carousel.style.transform = `translateX(${offset}%)`;
//     updateProgress();
//   }

//   // Add navigation button event listeners
//   if (prevBtn) {
//     prevBtn.addEventListener('click', () => {
//       if (currentSlide > 0) {
//         currentSlide--;
//         updateSlide();
//       }
//     });
//   }

//   if (nextBtn) {
//     nextBtn.addEventListener('click', () => {
//       if (currentSlide < totalSlides - 1) {
//         currentSlide++;
//         updateSlide();
//       }
//     });
//   }
  
//   // Add progress bar event listeners
//   if (progressBar) {
//     progressBar.addEventListener('mousedown', handleProgressClick);
//     progressBar.addEventListener('touchstart', (e) => {
//       e.preventDefault();
//       handleProgressClick(e.touches[0]);
//     }, { passive: false });
//   }
  
//   if (progressHandle) {
//     progressHandle.addEventListener('mousedown', startDragging);
//     progressHandle.addEventListener('touchstart', startDragging, { passive: false });
//   }

//   // Touch event handlers for carousel
//   let touchStartX = 0;
//   let touchEndX = 0;

//   carousel.addEventListener('touchstart', (e) => {
//     touchStartX = e.touches[0].clientX;
//     carousel.style.transition = 'none';
//   }, { passive: true });

//   carousel.addEventListener('touchmove', (e) => {
//     if (!touchStartX) return;
    
//     const currentX = e.touches[0].clientX;
//     const diff = touchStartX - currentX;
//     const movePercent = (diff / carousel.offsetWidth) * 100;
//     const translateX = -(currentSlide * 100 + movePercent);
    
//     carousel.style.transform = `translateX(${translateX}%)`;
//   }, { passive: true });

//   carousel.addEventListener('touchend', (e) => {
//     touchEndX = e.changedTouches[0].clientX;
    
//     const diff = touchStartX - touchEndX;
//     const threshold = carousel.offsetWidth * 0.2;
    
//     carousel.style.transition = 'transform 0.3s ease';
    
//     if (Math.abs(diff) > threshold) {
//       if (diff > 0 && currentSlide < totalSlides - 1) {
//         currentSlide++;
//       } else if (diff < 0 && currentSlide > 0) {
//         currentSlide--;
//       }
//     }
    
//     updateSlide();
//     touchStartX = 0;
//     touchEndX = 0;
//   }, { passive: true });
  
//   // Initialize progress bar
//   updateProgress();
// } 