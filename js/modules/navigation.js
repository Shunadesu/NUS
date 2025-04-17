// Navigation and mega menu functionality
export function setupNavigation() {
    const header = document.querySelector('.header');
    const headerBg = document.querySelector('.header__bg');
    const sidebar = document.querySelector('.sidebar');
    const megaMenu = document.querySelector('.mega-menu');
    const logoWhite = document.querySelector('.logo_div.white');
    const logoNormal = document.querySelector('.logo_div:not(.white)');
    if (!header || !headerBg || !sidebar || !megaMenu) return;
    
    const sidebarItems = document.querySelectorAll('.sidebar__item[data-category]');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const megaMenuColumns = document.querySelectorAll('.mega-menu__column');
    
    // State variables
    let activeCategory = null;
    let hoverTimeout = null;
    
    // Show menu function
    const showMenu = (category) => {
      // Cancel any pending hide operation
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Skip if already showing this category
      if (activeCategory === category) return;
      
      // Update state
      activeCategory = category;
      
      // Update UI classes - First animation frame
      requestAnimationFrame(() => {
        // Add active classes
        header.classList.add('menu-active');
        
        // Header background animation
        headerBg.classList.remove('slide-up');
        headerBg.classList.add('active');
        logoWhite.style.display = 'none';
        logoNormal.style.display = 'block';
        // Mega menu preparation
        megaMenu.classList.remove('slide-down');
        
        // Force reflow
        void headerBg.offsetWidth;
        void megaMenu.offsetWidth;
        
        // Add animation classes
        requestAnimationFrame(() => {
          headerBg.classList.add('slide-down');
          megaMenu.classList.add('active', 'slide-up');
        });
        
        // Update active link
        sidebarLinks.forEach(link => {
          const parentItem = link.closest('.sidebar__item');
          if (parentItem && parentItem.dataset.category === category) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Show correct mega menu column
        megaMenuColumns.forEach(column => {
          const isActive = column.dataset.category === category;
          column.classList.toggle('active', isActive);
          
          if (isActive) {
            // Animate menu items with staggered delay
            const columnItems = column.querySelectorAll('.column-item');
            columnItems.forEach((item, index) => {
              item.classList.remove('fade-in');
              void item.offsetWidth;
              setTimeout(() => {
                item.classList.add('fade-in');
              }, 150 + (index * 30));
            });
          }
        });
      });
    };
    
    // Hide menu function
    const hideMenu = () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      
      hoverTimeout = setTimeout(() => {
        if (!activeCategory) return;
        
        activeCategory = null;
        header.classList.remove('menu-active');
        
        requestAnimationFrame(() => {
          headerBg.classList.remove('slide-down');
          headerBg.classList.add('slide-up');
          
          megaMenu.classList.remove('slide-up');
          megaMenu.classList.add('slide-down');
          logoWhite.style.display = 'block';
          logoNormal.style.display = 'none';
          setTimeout(() => {
            megaMenu.classList.remove('active', 'slide-down');
          }, 150);
          
          setTimeout(() => {
            headerBg.classList.remove('active', 'slide-up');
          }, 300);
        });
        
        sidebarLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.column-item').forEach(item => {
          item.classList.remove('fade-in');
        });
      }, 100);
    };
    
    // Event listeners
    sidebarItems.forEach(item => {
      if (!item) return;
      
      const category = item.dataset.category;
      if (!category) return;
      
      item.addEventListener('mouseenter', () => {
        header.classList.add('sidebar-hover');
        
        megaMenu.classList.remove('active', 'slide-up', 'slide-down');
        void megaMenu.offsetWidth;
        
        if (activeCategory && activeCategory !== category) {
          megaMenuColumns.forEach(column => column.classList.remove('active'));
          void megaMenu.offsetWidth;
        }
        
        showMenu(category);
      });
    });
    
    sidebar.addEventListener('mouseleave', () => {
      if (!header.classList.contains('menu-active')) {
        header.classList.remove('sidebar-hover');
      }
      hideMenu();
    });
    
    megaMenu.addEventListener('mouseenter', () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    });
    
    megaMenu.addEventListener('mouseleave', hideMenu);
}