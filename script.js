document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('.otp-inputs input');
  const verifyBtn = document.getElementById('verifyBtn');
  const resendLink = document.getElementById('resendLink');
  const timer = document.getElementById('timer');
  const message = document.getElementById('message');
  const correctOTP = '1230'; // Change this for custom OTP
  let countdown = 30;
  let timerInterval;

  // Start the timer
  startTimer();

  // Auto-focus first input
  inputs[0].focus();

  // Handle input navigation
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      // Mark as filled
      input.classList.add('filled');
      
      // Auto-tab to next input when a digit is entered
      if (e.target.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      
      // Clear any previous messages
      message.style.display = 'none';
      message.className = '';
    });

    // Handle backspace to move to previous input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  // Verify OTP
  verifyBtn.addEventListener('click', verifyOTP);

  // Also verify when pressing Enter in last input
  inputs[inputs.length - 1].addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      verifyOTP();
    }
  });

  // Resend OTP
  resendLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (resendLink.classList.contains('disabled')) return;
    
    // Reset UI
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('filled', 'green-border', 'red-border');
      input.disabled = false;
    });
    message.style.display = 'none';
    message.className = '';
    verifyBtn.disabled = false;
    verifyBtn.textContent = 'Verify OTP';
    verifyBtn.style.backgroundColor = '#4f46e5';
    
    // Start new timer
    countdown = 30;
    startTimer();
    
    // Show success message
    showMessage('New OTP has been sent to your email!', 'success');
    inputs[0].focus();
  });

  function verifyOTP() {
    const enteredOTP = Array.from(inputs).map(input => input.value).join('');

    // Remove previous validation classes
    inputs.forEach(input => {
      input.classList.remove('green-border', 'red-border');
    });

    // Check if all fields are filled
    if (enteredOTP.length < 4) {
      showMessage('Please enter complete OTP code', 'error');
      return;
    }

    if (enteredOTP === correctOTP) {
      // Valid OTP
      inputs.forEach(input => input.classList.add('green-border'));
      showMessage('Email verified successfully!', 'success');
      
      // Disable inputs and button
      inputs.forEach(input => input.disabled = true);
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verified';
      verifyBtn.style.backgroundColor = '#10b981';
      
      // Stop timer
      clearInterval(timerInterval);
    } else {
      // Invalid OTP
      inputs.forEach(input => input.classList.add('red-border'));
      showMessage('Invalid OTP. Please try again.', 'error');
      inputs[0].focus();
    }
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    message.style.display = 'block';
  }

  function startTimer() {
    clearInterval(timerInterval);
    resendLink.classList.add('disabled');
    
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
      countdown--;
      updateTimerDisplay();
      
      if (countdown <= 0) {
        clearInterval(timerInterval);
        resendLink.classList.remove('disabled');
        timer.textContent = '';
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const seconds = countdown % 60;
    timer.textContent = `(${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(seconds).padStart(2, '0')})`;
  }
});