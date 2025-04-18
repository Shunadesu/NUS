import { initCart } from './modules/cart.js';
import { initReviews } from './modules/review.js'
import {initTabs} from './modules/tabs.js'

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initReviews();
    initCart();  

})

document.addEventListener('DOMContentLoaded', function() {
    // Initialize rent date picker (range selection)
    const rentDatePicker = flatpickr('#rent-date-picker', {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'd/m/Y',
      disableMobile: true,
      inline: true,
      onChange: function(selectedDates) {
        const rangeDisplay = document.getElementById('rent-date-range-display');
        const startDateEl = document.getElementById('rent-start-date');
        const endDateEl = document.getElementById('rent-end-date');
        const durationEl = document.getElementById('rent-duration');
        const confirmBtn = document.getElementById('rent-confirm-btn');
        
        if (selectedDates.length === 2) {
          // Both dates selected
          startDateEl.textContent = formatDateShort(selectedDates[0]);
          endDateEl.textContent = formatDateShort(selectedDates[1]);
          
          const days = calculateDays(selectedDates[0], selectedDates[1]);
          durationEl.textContent = `Thời gian thuê: ${days} ngày`;
          
          rangeDisplay.style.display = 'flex';
          confirmBtn.disabled = false;
        } else if (selectedDates.length === 1) {
          // Only start date selected
          startDateEl.textContent = formatDateShort(selectedDates[0]);
          endDateEl.textContent = '--/--/----';
          durationEl.textContent = '';
          
          rangeDisplay.style.display = 'flex';
          confirmBtn.disabled = true;
        } else {
          // No dates selected
          rangeDisplay.style.display = 'none';
          durationEl.textContent = '';
          confirmBtn.disabled = true;
        }
      }
    });
    
    // Initialize try date picker (single date selection)
    const tryDatePicker = flatpickr('#try-date-picker', {
      minDate: 'today',
      dateFormat: 'd/m/Y',
      disableMobile: true,
      inline: true,
      onChange: function(selectedDates) {
        const dateEl = document.getElementById('try-date');
        const confirmBtn = document.getElementById('try-confirm-btn');
        
        if (selectedDates.length > 0) {
          dateEl.textContent = formatDate(selectedDates[0]);
          confirmBtn.disabled = false;
        } else {
          dateEl.textContent = 'Chưa chọn ngày';
          confirmBtn.disabled = true;
        }
      }
    });
    
    // Show relevant calendar when button is clicked
    document.getElementById('rent-btn').addEventListener('click', function() {
      hideAllCalendars();
      hideAllConfirmations();
      document.getElementById('rent-calendar').classList.add('active');
    });
    
    document.getElementById('try-btn').addEventListener('click', function() {
      hideAllCalendars();
      hideAllConfirmations();
      document.getElementById('try-calendar').classList.add('active');
    });
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', function() {
        const calendarId = this.getAttribute('data-calendar');
        document.getElementById(calendarId).classList.remove('active');
      });
    });
    
    // Rent confirmation
    document.getElementById('rent-confirm-btn').addEventListener('click', function() {
      const selectedDates = rentDatePicker.selectedDates;
      
      if (selectedDates.length === 2) {
        const startDate = selectedDates[0];
        const endDate = selectedDates[1];
        const days = calculateDays(startDate, endDate);
        
        document.getElementById('rent-confirmed-period').textContent = 
          `Từ ${formatDate(startDate)} đến ${formatDate(endDate)}`;
        document.getElementById('rent-confirmed-duration').textContent = 
          `Thời gian thuê: ${days} ngày`;
        
        hideAllCalendars();
        hideAllConfirmations();
        document.getElementById('rent-confirmation').classList.add('active');
        
        rentDatePicker.clear();
        document.getElementById('rent-date-range-display').style.display = 'none';
        document.getElementById('rent-duration').textContent = '';
        this.disabled = true;
      }
    });
    
    // Try-on confirmation
    document.getElementById('try-confirm-btn').addEventListener('click', function() {
      const selectedDate = tryDatePicker.selectedDates[0];
      
      if (selectedDate) {
        document.getElementById('try-confirmed-date').textContent = 
          formatDate(selectedDate);
        
        hideAllCalendars();
        hideAllConfirmations();
        document.getElementById('try-confirmation').classList.add('active');
        
        tryDatePicker.clear();
        document.getElementById('try-date').textContent = 'Chưa chọn ngày';
        this.disabled = true;
      }
    });
    
    // Helper functions
    function hideAllCalendars() {
      document.querySelectorAll('.calendar-container').forEach(calendar => {
        calendar.classList.remove('active');
      });
    }
    
    function hideAllConfirmations() {
      document.querySelectorAll('.confirmation-message').forEach(message => {
        message.classList.remove('active');
      });
    }
    
    function formatDateShort(date) {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
    
    function formatDate(date) {
      return date.toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    function calculateDays(startDate, endDate) {
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      // Add 1 because rental period includes both start and end dates
      return Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    }
  });


  // Mobile menu functionality
  if (mobileMenuToggle) {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Clone navigation for mobile menu
    const nav = document.querySelector('.nav');
    if (nav) {
      const mobileNav = document.createElement('nav');
      mobileNav.className = 'mobile-nav';
      
      const navList = nav.querySelector('.nav__list');
      if (navList) {
        const mobileNavList = navList.cloneNode(true);
        mobileNavList.className = 'mobile-nav__list';
        
        // Update classes for mobile
        const navItems = mobileNavList.querySelectorAll('.nav__item');
        navItems.forEach(item => {
          item.className = 'mobile-nav__item';
          const link = item.querySelector('.nav__link');
          if (link) {
            link.className = 'mobile-nav__link';
          }
        });
        
        mobileNav.appendChild(mobileNavList);
        mobileMenu.appendChild(mobileNav);
      }
    }
    
    // Add close button to mobile menu
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close menu');
    mobileMenu.insertBefore(closeBtn, mobileMenu.firstChild);
    
    // Append mobile menu to body
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      
      // Animate hamburger to X
      this.classList.toggle('active');
      
      // Update aria-expanded
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
    });
    
    // Close mobile menu when clicking close button
    closeBtn.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
    
    // Close mobile menu when clicking overlay
    overlay.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  }