// Xác định rank hiện tại (giả lập, bạn có thể thay đổi)
const currentRank = 'loving'; // 'caring', 'loving', hoặc 'privilege'

// Lấy trạng thái đăng nhập
const userEmail = localStorage.getItem('loggedInUserEmail');

// Lấy tất cả các nút Get Started
const rankButtons = document.querySelectorAll('.membership-table .btn[data-rank]');

rankButtons.forEach(btn => {
    const btnRank = btn.getAttribute('data-rank');
    if (userEmail) {
        // Nếu đã đăng nhập
        if (btnRank === currentRank) {
            btn.textContent = 'Current Level';
            btn.classList.add('active');
            btn.setAttribute('disabled', 'disabled');
            btn.href = 'javascript:void(0)';
        } else {
            btn.textContent = 'Get Started';
            btn.classList.remove('active');
            btn.removeAttribute('disabled');
            // Có thể cho href dẫn đến trang nâng cấp hoặc giữ nguyên
        }
    } else {
        // Nếu chưa đăng nhập, bấm vào sẽ chuyển sang login
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/pages/login.html';
        });
    }
});