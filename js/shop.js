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