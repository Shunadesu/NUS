// notification.js - Handles notification display functionality

// Add notification styles to document
function addNotificationStyles() {
    // Check if styles are already added to avoid duplicates
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
        .notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: var(--primary-color, #4a90e2);
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
          transform: translateY(100px);
          opacity: 0;
          transition: transform 0.3s, opacity 0.3s;
          z-index: 1000;
        }
        
        .notification.show {
          transform: translateY(0);
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Function to show notification
  export function showNotification(message, duration = 3000) {
    // Ensure styles are added
    addNotificationStyles();
    
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
  
    // Add to body
    document.body.appendChild(notification);
  
    // Show notification (using setTimeout to trigger animation)
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
  
    // Remove notification after delay
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300); // Wait for fade out animation
    }, duration);
  }
  
  // Initialize notification system
  export function initNotifications() {
    // Add styles
    addNotificationStyles();
  }