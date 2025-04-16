// product-options.js - Handles product options like color selection and quantity

export function initProductOptions() {
    // Initialize color selection
    initColorSelection();
    
    // Initialize quantity selector
    initQuantitySelector();
    
    // Initialize terms and conditions
    initTermsAndConditions();
  }
  
  // Color selection functionality
  function initColorSelection() {
    const colorOptions = document.querySelectorAll(".color-option");
    const selectedColorText = document.querySelector(".selected-option");
    
    if (!colorOptions.length || !selectedColorText) return;
  
    colorOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Update selected color
        colorOptions.forEach((o) => o.classList.remove("selected"));
        this.classList.add("selected");
  
        // Update selected color text
        const colorName = this.getAttribute("data-color");
        selectedColorText.textContent = colorName;
      });
    });
  }
  
  // Quantity selector functionality
  function initQuantitySelector() {
    const quantityInput = document.querySelector(".quantity-input");
    const decreaseBtn = document.querySelector(".quantity-decrease");
    const increaseBtn = document.querySelector(".quantity-increase");
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
  
    decreaseBtn.addEventListener("click", () => {
      const value = Number.parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });
  
    increaseBtn.addEventListener("click", () => {
      const value = Number.parseInt(quantityInput.value);
      if (value < Number.parseInt(quantityInput.max)) {
        quantityInput.value = value + 1;
      }
    });
  }
  
  // Terms and conditions modal functionality
  function initTermsAndConditions() {
    const termsModal = document.getElementById("termsModal");
    const termsLink = document.querySelector(".terms-link");
    const closeTerms = document.querySelector(".close-terms");
    const agreeTerms = document.getElementById("agreeTerms");
    const agreeTermsInline = document.getElementById("agreeTermsInline");
    const termsAcceptBtn = document.querySelector(".terms-accept-btn");
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    
    if (!termsModal || !termsLink) return;
  
    // Disable add to cart button initially if terms checkbox exists
    if (agreeTermsInline && addToCartBtn) {
      addToCartBtn.disabled = true;
      addToCartBtn.style.opacity = "0.6";
      addToCartBtn.style.cursor = "not-allowed";
    }
  
    // Open terms modal
    if (termsLink) {
      termsLink.addEventListener("click", (e) => {
        e.preventDefault();
        termsModal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    }
  
    // Close terms modal
    if (closeTerms) {
      closeTerms.addEventListener("click", () => {
        termsModal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      });
    }
  
    // Close modal when clicking outside the content
    window.addEventListener("click", (event) => {
      if (event.target === termsModal) {
        termsModal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  
    // Accept terms button
    if (termsAcceptBtn && agreeTerms && agreeTermsInline && addToCartBtn) {
      termsAcceptBtn.addEventListener("click", () => {
        if (agreeTerms.checked) {
          agreeTermsInline.checked = true;
          termsModal.style.display = "none";
          document.body.style.overflow = ""; // Restore scrolling
  
          // Enable add to cart button
          addToCartBtn.disabled = false;
          addToCartBtn.style.opacity = "1";
          addToCartBtn.style.cursor = "pointer";
        } else {
          // Shake the checkbox to indicate it needs to be checked
          agreeTerms.parentElement.classList.add("shake");
          setTimeout(() => {
            agreeTerms.parentElement.classList.remove("shake");
          }, 500);
        }
      });
    }
  
    // Inline terms checkbox
    if (agreeTermsInline && addToCartBtn) {
      agreeTermsInline.addEventListener("change", function () {
        if (this.checked) {
          addToCartBtn.disabled = false;
          addToCartBtn.style.opacity = "1";
          addToCartBtn.style.cursor = "pointer";
        } else {
          addToCartBtn.disabled = true;
          addToCartBtn.style.opacity = "0.6";
          addToCartBtn.style.cursor = "not-allowed";
        }
      });
    }
  
    // Add shake animation for checkbox validation
    addShakeAnimation();
  }
  
  // Add shake animation CSS
  function addShakeAnimation() {
    // Check if the style already exists to avoid duplicates
    if (!document.getElementById("shake-animation-style")) {
      const styleTerms = document.createElement("style");
      styleTerms.id = "shake-animation-style";
      styleTerms.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `;
      document.head.appendChild(styleTerms);
    }
  }