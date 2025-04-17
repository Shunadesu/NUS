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
    const zoomResult = document.querySelector(".zoom-result");
    if (zoomLens && zoomResult) {
      imageZoom(mainImage, zoomLens, zoomResult);
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
  
  // Fade out current image
  mainImage.style.opacity = "0";

  // After fade out, update src and fade in
  setTimeout(() => {
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
    
    mainImage.style.opacity = "1";
  }, 200);
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

// Image zoom functionality
function imageZoom(img, lens, result) {
  if (!img || !lens || !result) return;
  
  let cx, cy;

  // Calculate the ratio between result DIV and lens
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;

  // Set background properties for the result DIV
  result.style.backgroundImage = `url('${img.src}')`;
  result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;

  // Mouse move function
  function moveLens(e) {
    let pos, x, y;
    // Prevent any other actions that may occur when moving over the image
    e.preventDefault();
    // Get the cursor's x and y positions
    pos = getCursorPos(e);
    // Calculate the position of the lens
    x = pos.x - lens.offsetWidth / 2;
    y = pos.y - lens.offsetHeight / 2;

    // Prevent the lens from being positioned outside the image
    if (x > img.width - lens.offsetWidth) {
      x = img.width - lens.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > img.height - lens.offsetHeight) {
      y = img.height - lens.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }

    // Set the position of the lens
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    // Display what the lens "sees"
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
  }

  function getCursorPos(e) {
    let a,
      x = 0,
      y = 0;
    e = e || window.event;
    // Get the x and y positions of the image
    a = img.getBoundingClientRect();
    // Calculate the cursor's x and y coordinates, relative to the image
    x = e.pageX - a.left - window.pageXOffset;
    y = e.pageY - a.top - window.pageYOffset;
    // Consider any page scrolling
    return { x: x, y: y };
  }

  // Show zoom on hover
  img.addEventListener("mouseover", () => {
    lens.style.display = "block";
    result.style.display = "block";
  });

  // Hide zoom when mouse leaves
  img.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
  });

  // Move lens on mouse move
  img.addEventListener("mousemove", moveLens);
  lens.addEventListener("mousemove", moveLens);

  // Click events for lens and image
  const imageModal = document.getElementById("imageModal");
  if (imageModal) {
    // Add a click event listener to the zoom-lens element to open the modal
    lens.addEventListener("click", (e) => {
      e.preventDefault();
      // Open the zoom modal when lens is clicked
      imageModal.style.display = "block";
    });

    // Also, let's make the main image clickable to open the zoom modal
    img.addEventListener("click", (e) => {
      e.preventDefault();
      // Open the zoom modal when image is clicked
      imageModal.style.display = "block";
    });
  }
}