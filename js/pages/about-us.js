
document.addEventListener('DOMContentLoaded', function() {
  initCounterAnimation();
});


function initCounterAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  
  const options = {
      threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const target = parseFloat(entry.target.getAttribute('data-target'));
              const duration = 2000; // Animation duration in milliseconds
              const steps = 50; // Number of steps in the animation
              const stepDuration = duration / steps;
              let current = 0;
              
              const increment = target / steps;
              const isDecimal = target % 1 !== 0;
              
              const counter = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                      entry.target.textContent = target;
                      clearInterval(counter);
                  } else {
                      entry.target.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                  }
              }, stepDuration);
              
              observer.unobserve(entry.target);
          }
      });
  }, options);

  stats.forEach(stat => observer.observe(stat));
} 