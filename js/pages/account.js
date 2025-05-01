 // Nếu có sản phẩm trong oders thì gọi lên

    // document.addEventListener('DOMContentLoaded', function() {
    // // Lấy orders từ localStorage
    // const orders = JSON.parse(localStorage.getItem('orders')) || [];
    // const orderHistorySection = document.querySelector('.order-history');

    // if (orders.length === 0) {
    //     orderHistorySection.innerHTML = `
    //         <h2>Order history</h2>
    //         <div class="order-message success">
    //             <p>
    //                 <span class="icon">✓</span>
    //                 <a href="/pages/shop.html" class="first-order-link">Make your first order</a>. You haven't placed any orders yet.
    //             </p>
    //         </div>
    //     `;
    // } else {
    //     let html = `
    //         <h2>Order history</h2>
    //         <table class="order-table">
    //             <thead>
    //                 <tr>
    //                     <th>Order ID</th>
    //                     <th>Date</th>
    //                     <th>Total</th>
    //                     <th>Status</th>
    //                     <th>Action</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //     `;
    //     orders.forEach(order => {
    //         html += `
    //             <tr>
    //                 <td>${order.id}</td>
    //                 <td>${order.date}</td>
    //                 <td>${order.total}</td>
    //                 <td>${order.status}</td>
    //                 <td><button class="view-order-btn" data-id="${order.id}">View</button></td>
    //             </tr>
    //         `;
    //     });
    //     html += `
    //             </tbody>
    //         </table>
    //     `;
    //     orderHistorySection.innerHTML = html;
    // }

    // // (Optional) Thêm sự kiện cho nút View để xem chi tiết đơn hàng
    // document.querySelectorAll('.view-order-btn').forEach(btn => {
    //     btn.addEventListener('click', function() {
    //         const orderId = btn.getAttribute('data-id');
    //         // Hiển thị modal hoặc chuyển trang chi tiết đơn hàng
    //         alert('Order detail for: ' + orderId);
    //     });
    // });
    // });


      // Khi user đặt hàng thành công:
      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
      id: 'order_' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      items: [/* ... */],
      total: 500,
      status: 'Pending'
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));