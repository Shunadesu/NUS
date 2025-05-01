  // Filter Sidebar Toggle
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterSidebar = document.getElementById('filterSidebar');
  const filterOverlay = document.getElementById('filterOverlay');
  const closeFilterBtn = document.getElementById('closeFilterBtn');

  function toggleFilter() {
      filterSidebar.classList.toggle('active');
      filterOverlay.classList.toggle('active');
      document.body.style.overflow = filterSidebar.classList.contains('active') ? 'hidden' : '';
  }

  filterToggleBtn.addEventListener('click', toggleFilter);
  closeFilterBtn.addEventListener('click', toggleFilter);
  filterOverlay.addEventListener('click', toggleFilter);


  document.addEventListener('DOMContentLoaded', () => {
    // Get all blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    
    // Add animation classes with delay for staggered appearance
    blogCards.forEach((card, index) => {
      // Add initial hidden state
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity var(--transition-normal) ease, transform var(--transition-normal) ease';
      
      // Staggered appearance
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 80 * index);
    });
    
    // Lazy loading for images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('.blog-image img');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Add loading animation
              img.style.animation = 'fadeIn var(--transition-normal) ease-in-out';
              
              // Stop observing after loading
              observer.unobserve(img);
            }
          });
        });
        
        // Observe each image
        images.forEach(img => {
          imageObserver.observe(img);
        });
      }
    };
    
    lazyLoadImages();
    
    // Add click event to cards for navigation
    blogCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.blog-title').textContent;
        console.log(`Navigating to article: ${title}`);
        
        // Add click animation
        card.classList.add('card-clicked');
        setTimeout(() => {
          card.classList.remove('card-clicked');
        }, 300);
      });
    });
    
    // Optional: Create simple filtering functionality
    const addFilterSystem = () => {
      const categories = ['All', 'Fashion', 'Travel', 'Beauty', 'Lifestyle'];
      const filterContainer = document.createElement('div');
      filterContainer.className = 'filter-container';
      
      categories.forEach(category => {
        const button = document.createElement('button');
        button.className = category === 'All' ? 'filter-btn active' : 'filter-btn';
        button.textContent = category;
        
        button.addEventListener('click', (e) => {
          // Remove active class from all buttons
          document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          
          // Add active class to clicked button
          e.target.classList.add('active');
          
          // Filter cards based on category
          filterCards(category);
        });
        
        filterContainer.appendChild(button);
      });
      
      // Insert filter at top of container
      const container = document.querySelector('.container');
      container.insertBefore(filterContainer, container.firstChild);
    };
    
    // Function to filter cards
    const filterCards = (category) => {
      const cards = document.querySelectorAll('.blog-card');
      
      if (category === 'All') {
        cards.forEach(card => {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 100);
        });
      } else {
        cards.forEach(card => {
          // This is just for demo - in a real implementation,
          // you would check the actual category of each card
          const randomShow = Math.random() > 0.5;
          
          if (randomShow) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 100);
          } else {
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.display = 'none';
            }, 500);
          }
        });
      }
    };
    
    // Uncomment to enable filtering
    // addFilterSystem();
  });