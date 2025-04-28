// contact.js - Logic for Contact Us page

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Validate
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const comment = form.querySelector('textarea[name="comment"]');
    let valid = true;
    [name, email, comment].forEach(input => {
      input.classList.remove('input-error');
      if (!input.value.trim()) {
        input.classList.add('input-error');
        valid = false;
      }
    });
    if (!validateEmail(email.value)) {
      email.classList.add('input-error');
      valid = false;
    }
    if (!valid) return;

    // Simulate sending (replace with real API call if needed)
    showMessage('Sending...', 'info');
    setTimeout(() => {
      showMessage('Your message has been sent successfully!', 'success');
      form.reset();
    }, 1200);
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(msg, type) {
    let msgBox = document.getElementById('contactMsgBox');
    if (!msgBox) {
      msgBox = document.createElement('div');
      msgBox.id = 'contactMsgBox';
      form.prepend(msgBox);
    }
    msgBox.textContent = msg;
    msgBox.className = 'contact-msg ' + type;
    setTimeout(() => {
      msgBox.textContent = '';
      msgBox.className = 'contact-msg';
    }, 3000);
  }
}); 