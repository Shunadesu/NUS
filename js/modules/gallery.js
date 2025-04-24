// gallery.js - Handles the product image gallery functionality

// State variables
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

export function initGallery() {
  // DOM Elements
  const thumbnails = document.querySelectorAll(".thumbnail");
  const thumbnailsContainer = document.querySelector(".thumbnails-container");
  const mainImage = document.getElementById("mainImage");
  const thumbnailPrevBtn = document.querySelector(".thumbnail-prev");
  const thumbnailNextBtn = document.querySelector(".thumbnail-next");
  const mainPrevBtn = document.querySelector(".main-prev");
  const mainNextBtn = document.querySelector(".main-next");
  const imageContainer = document.querySelector(".image-container");
  
  if (!thumbnails.length || !mainImage) return;
  
  // Constants
  const thumbnailHeight = 90 + 12; // Height + gap
  const thumbnailWidth = 70 + 12; // Width + gap for mobile
  const visibleThumbnails = 4; // Number of thumbnails visible at once

  // Array to store all image sources for preloading
  const imageSources = Array.from(thumbnails).map((thumbnail) => thumbnail.querySelector("img").src);

  // Preload images
  preloadImages(imageSources);

  // Set initial main image if not set in HTML
  const mainImageSrc = document.querySelector(".thumbnail.active img")?.src;
  if (mainImageSrc) {
    mainImage.src = mainImageSrc;
    if (document.getElementById("zoomedImage")) {
      document.getElementById("zoomedImage").src = mainImageSrc;
    }
  }

  // Add transition style to main image
  mainImage.style.transition = "opacity 0.3s ease-in-out";

  // Thumbnail click handler
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateActiveThumbnail(index, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
      updateMainImage(index, thumbnails, mainImage);
    });
  });

  // Thumbnail navigation button handlers
  if (thumbnailPrevBtn) {
    thumbnailPrevBtn.addEventListener("click", () => {
      const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
      updateMainImage(newIndex, thumbnails, mainImage);
    });
  }

  if (thumbnailNextBtn) {
    thumbnailNextBtn.addEventListener("click", () => {
      const newIndex = (currentIndex + 1) % thumbnails.length;
      updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
      updateMainImage(newIndex, thumbnails, mainImage);
    });
  }

  // Main image navigation buttons
  if (mainPrevBtn) {
    mainPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event bubbling
      const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
      updateMainImage(newIndex, thumbnails, mainImage);
    });
  }

  if (mainNextBtn) {
    mainNextBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event bubbling
      const newIndex = (currentIndex + 1) % thumbnails.length;
      updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
      updateMainImage(newIndex, thumbnails, mainImage);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Only handle arrow keys if the gallery is in focus or fullscreen gallery is open
    const galleryModal = document.getElementById("galleryModal");
    
    if (
      document.activeElement === document.body ||
      imageContainer.contains(document.activeElement) ||
      (galleryModal && galleryModal.style.display === "block")
    ) {
      if (e.key === "ArrowLeft") {
        const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
        updateMainImage(newIndex, thumbnails, mainImage);
      } else if (e.key === "ArrowRight") {
        const newIndex = (currentIndex + 1) % thumbnails.length;
        updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
        updateMainImage(newIndex, thumbnails, mainImage);
      }
    }
  });

  // Touch swipe support
  if (imageContainer) {
    imageContainer.addEventListener("touchstart", handleTouchStart, false);
    imageContainer.addEventListener("touchmove", handleTouchMove, false);
    imageContainer.addEventListener("touchend", () => {
      handleTouchEnd(thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth, mainImage);
    }, false);
  }

  // Window resize handler
  window.addEventListener("resize", () => {
    // Recalculate positions based on current device orientation
    updateActiveThumbnail(currentIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
  });

  // Initialize zoom functionality after image is loaded
  mainImage.addEventListener("load", () => {
    const zoomLens = document.querySelector(".zoom-lens");
    if (zoomLens) {
      imageZoom(mainImage, zoomLens);
    }
  });
}

// Function to preload images
function preloadImages(sources) {
  sources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Function to update main image
export function updateMainImage(index, thumbnails, mainImage) {
  if (!thumbnails || !mainImage) return;
  
  mainImage.style.opacity = "0.7"; // Slight fade for smooth transition

  const imgSrc = thumbnails[index].querySelector("img").src;
  mainImage.src = imgSrc;
    
  // Update zoomed image if it exists
  if (document.getElementById("zoomedImage")) {
    document.getElementById("zoomedImage").src = imgSrc;
  }
    
  // Update gallery main image if it exists
  const galleryMainImage = document.getElementById("galleryMainImage");
  if (galleryMainImage) {
    galleryMainImage.src = imgSrc;
  }
    
  // Restore opacity after image loads
  mainImage.onload = () => {
    mainImage.style.opacity = "1";
  };
}

// Function to update active thumbnail
export function updateActiveThumbnail(index, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth) {
  if (!thumbnails || !thumbnailsContainer) return;
  
  thumbnails.forEach((t) => t.classList.remove("active"));
  thumbnails[index].classList.add("active");
  currentIndex = index;

  // Update gallery thumbnails if they exist
  const galleryThumbnailElements = document.querySelectorAll(".gallery-thumb");
  if (galleryThumbnailElements.length > 0) {
    galleryThumbnailElements.forEach((t) => t.classList.remove("active"));
    galleryThumbnailElements[index].classList.add("active");
  }

  // Slide the thumbnails to keep active one in view
  const isMobile = window.innerWidth <= 576;

  if (isMobile) {
    thumbnailsContainer.style.transform = `translateX(-${currentIndex * thumbnailWidth}px)`;
  } else {
    // Calculate position to center the active thumbnail
    const containerHeight = visibleThumbnails * thumbnailHeight;
    let offset = currentIndex * thumbnailHeight - (containerHeight - thumbnailHeight) / 2;

    // Clamp the offset to prevent overscrolling
    const maxOffset = thumbnails.length * thumbnailHeight - containerHeight;
    offset = Math.max(0, Math.min(offset, maxOffset));

    thumbnailsContainer.style.transform = `translateY(-${offset}px)`;
  }
}

// Touch handlers
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
  touchEndX = e.touches[0].clientX;
}

function handleTouchEnd(thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth, mainImage) {
  if (touchStartX - touchEndX > 50) {
    // Swipe left - next image
    const newIndex = (currentIndex + 1) % thumbnails.length;
    updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
    updateMainImage(newIndex, thumbnails, mainImage);
  }

  if (touchEndX - touchStartX > 50) {
    // Swipe right - previous image
    const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    updateActiveThumbnail(newIndex, thumbnails, thumbnailsContainer, visibleThumbnails, thumbnailHeight, thumbnailWidth);
    updateMainImage(newIndex, thumbnails, mainImage);
  }

  // Reset values
  touchStartX = 0;
  touchEndX = 0;
}

// Image zoom functionality - Modified for zoom inside the lens
function imageZoom(img, lens) {
  if (!img || !lens) return;

  const zoomFactor = 3; // Adjust this value to control zoom level

  // Set background image for the lens
  lens.style.backgroundImage = `url('${img.src}')`;
  lens.style.backgroundRepeat = 'no-repeat';

  // Calculate background size based on zoom factor
  const bgWidth = img.width * zoomFactor;
  const bgHeight = img.height * zoomFactor;
  // lens.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

  // Helper function to get cursor position relative to the image
  function getCursorPos(e) {
    const bounds = img.getBoundingClientRect();
    // Use clientX/clientY for position relative to viewport, then adjust for image position
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    return { x, y };
  }

  // Function to move the lens and update its background position
  function moveLens(e) {
    e.preventDefault();

    // Get cursor position
    const pos = getCursorPos(e);
    let x = pos.x;
    let y = pos.y;

    // Calculate lens center offsets
    const lensWidthHalf = lens.offsetWidth / 2;
    const lensHeightHalf = lens.offsetHeight / 2;

    // Calculate lens position (top-left corner)
    let lensX = x - lensWidthHalf;
    let lensY = y - lensHeightHalf;

    // Prevent lens from going outside the image boundaries
    lensX = Math.max(0, Math.min(lensX, img.width - lens.offsetWidth));
    lensY = Math.max(0, Math.min(lensY, img.height - lens.offsetHeight));

    // Set the lens position
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    // Calculate the background position for the lens
    // Offset the background by the negative of the lens position multiplied by the zoom factor
    const bgPosX = -(lensX * zoomFactor);
    const bgPosY = -(lensY * zoomFactor);
    lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  }

  // Show lens on mouse enter
  img.addEventListener("mouseenter", (e) => {
    // Initial calculation for background size (in case image size changes)
    const bgWidth = img.width * zoomFactor;
    const bgHeight = img.height * zoomFactor;
    lens.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
    lens.style.backgroundImage = `url('${img.src}')`; // Ensure image src is current
    
    lens.style.display = "block";
    moveLens(e); // Position lens immediately
  });

  // Hide lens on mouse leave
  img.addEventListener("mouseleave", () => {
    lens.style.display = "none";
  });

  // Move lens on mouse move over the image
  img.addEventListener("mousemove", moveLens);
  // Optional: Allow moving mouse over the lens itself (might feel smoother)
  lens.addEventListener("mousemove", moveLens); 
}
