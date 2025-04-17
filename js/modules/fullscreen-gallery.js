// fullscreen-gallery.js - Handles the fullscreen gallery functionality

// Import from gallery module to reuse functionality
import { updateMainImage } from './gallery.js';

// State variable
let currentIndex = 0;

export function initFullscreenGallery() {
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const galleryModal = document.getElementById("galleryModal");
  const closeGallery = document.querySelector(".close-gallery");
  const galleryMainImage = document.getElementById("galleryMainImage");
  const galleryPrevBtn = document.querySelector(".gallery-prev");
  const galleryNextBtn = document.querySelector(".gallery-next");
  const galleryThumbs = document.querySelector(".gallery-thumbs");
  const thumbnails = document.querySelectorAll(".thumbnail");
  
  if (!fullscreenBtn || !galleryModal || !galleryMainImage || !galleryThumbs) return;
  
  // Find the currently active thumbnail index
  thumbnails.forEach((thumbnail, index) => {
    if (thumbnail.classList.contains("active")) {
      currentIndex = index;
    }
  });

  // Open fullscreen gallery
  fullscreenBtn.addEventListener("click", () => {
    createGalleryThumbnails(thumbnails, galleryThumbs);
    galleryModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // Close fullscreen gallery
  if (closeGallery) {
    closeGallery.addEventListener("click", () => {
      galleryModal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    });
  }

  // Gallery navigation
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener("click", () => {
      const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateGalleryImage(newIndex, thumbnails, galleryMainImage);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener("click", () => {
      const newIndex = (currentIndex + 1) % thumbnails.length;
      updateGalleryImage(newIndex, thumbnails, galleryMainImage);
    });
  }
}

// Create gallery thumbnails in fullscreen mode
function createGalleryThumbnails(thumbnails, galleryThumbs) {
  if (!thumbnails || !galleryThumbs) return;
  
  galleryThumbs.innerHTML = "";

  thumbnails.forEach((thumbnail, index) => {
    const imgSrc = thumbnail.querySelector("img").src;
    const galleryThumb = document.createElement("div");
    galleryThumb.className = `gallery-thumb ${index === currentIndex ? "active" : ""}`;
    galleryThumb.innerHTML = `<img src="${imgSrc}" alt="Gallery thumbnail ${index + 1}">`;

    galleryThumb.addEventListener("click", () => {
      updateGalleryImage(index, thumbnails, document.getElementById("galleryMainImage"));
    });

    galleryThumbs.appendChild(galleryThumb);
  });

  // Set initial gallery image
  const galleryMainImage = document.getElementById("galleryMainImage");
  if (galleryMainImage) {
    galleryMainImage.src = thumbnails[currentIndex].querySelector("img").src;
  }
}

// Update gallery image in fullscreen mode
function updateGalleryImage(index, thumbnails, galleryMainImage) {
  if (!thumbnails || !galleryMainImage) return;
  
  // Update active thumbnail
  const galleryThumbnailElements = document.querySelectorAll(".gallery-thumb");
  galleryThumbnailElements.forEach((t) => t.classList.remove("active"));
  galleryThumbnailElements[index].classList.add("active");

  // Update main image
  galleryMainImage.src = thumbnails[index].querySelector("img").src;

  // Also update the product page main image
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    updateMainImage(index, thumbnails, mainImage);
  }

  // Update current index
  currentIndex = index;
  
  // Update the product thumbnails as well
  thumbnails.forEach((t) => t.classList.remove("active"));
  thumbnails[index].classList.add("active");
}