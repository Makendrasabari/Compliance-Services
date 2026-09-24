/**
 * STACKLY COMPLIANCE & SERVICES - AUTHENTICATION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initSignupForm();
});

/* --------------------------------------------------------------------------
   LOGIN FORM LOGIC
   -------------------------------------------------------------------------- */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const nameInput = document.getElementById('loginName');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const roleInput = document.getElementById('selectedRole');

  const nameError = document.getElementById('loginNameError');
  const emailError = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');
  const roleError = document.getElementById('loginRoleError');
  const generalFeedback = document.getElementById('loginGeneralFeedback');

  // Interactive 2-box compliance role selector
  const roleBoxes = document.querySelectorAll('#loginRoleBoxes .role-box');
  roleBoxes.forEach(box => {
    function selectRoleBox() {
      roleBoxes.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      box.classList.add('active');
      box.setAttribute('aria-checked', 'true');
      const selectedVal = box.getAttribute('data-role');
      if (roleInput) {
        roleInput.value = selectedVal;
      }
      if (roleError) {
        roleError.textContent = '';
        roleError.style.display = 'none';
      }
    }

    box.addEventListener('click', selectRoleBox);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRoleBox();
      }
    });
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages
    if (nameError) { nameError.textContent = ''; nameError.style.display = 'none'; }
    if (emailError) { emailError.textContent = ''; emailError.style.display = 'none'; }
    if (passwordError) { passwordError.textContent = ''; passwordError.style.display = 'none'; }
    if (roleError) { roleError.textContent = ''; roleError.style.display = 'none'; }
    if (generalFeedback) { generalFeedback.style.display = 'none'; }

    // 1. Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (nameError) {
        nameError.textContent = 'Please enter your name to personalize your dashboard.';
        nameError.style.display = 'block';
      }
      isValid = false;
    }

    // 2. Validate Gmail format (must strictly end with @gmail.com)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailVal) {
      if (emailError) {
        emailError.textContent = 'Email address is required.';
        emailError.style.display = 'block';
      }
      isValid = false;
    } else if (!gmailRegex.test(emailVal)) {
      if (emailError) {
        emailError.textContent = 'Invalid format. Please enter a valid Gmail address ending with @gmail.com.';
        emailError.style.display = 'block';
      }
      isValid = false;
    }

    // 3. Validate Password (strictly 8 characters, letters and numbers)
    const passwordVal = passwordInput ? passwordInput.value : '';
    const passRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passwordVal) {
      if (passwordError) {
        passwordError.textContent = 'Password is required.';
        passwordError.style.display = 'block';
      }
      isValid = false;
    } else if (passwordVal.length !== 8) {
      if (passwordError) {
        passwordError.textContent = 'Password must be exactly 8 characters in length.';
        passwordError.style.display = 'block';
      }
      isValid = false;
    } else if (!passRegex.test(passwordVal)) {
      if (passwordError) {
        passwordError.textContent = 'Password must contain only letters and numbers (e.g. ABC12345).';
        passwordError.style.display = 'block';
      }
      isValid = false;
    }

    // 4. Validate Role selection
    const roleVal = roleInput ? roleInput.value.trim() : '';
    if (!roleVal) {
      if (roleError) {
        roleError.textContent = 'Please select a compliance role.';
        roleError.style.display = 'block';
      }
      isValid = false;
    }

    if (!isValid) return;

    // Successful Validation - Store user data dynamically in localStorage & sessionStorage
    const userData = {
      name: nameVal,
      email: emailVal,
      role: roleVal,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('stackly_user', JSON.stringify(userData));
    sessionStorage.setItem('stackly_user', JSON.stringify(userData));

    if (generalFeedback) {
      generalFeedback.textContent = 'Authentication successful! Redirecting to your compliance dashboard...';
      generalFeedback.className = 'form-feedback success';
      generalFeedback.style.display = 'block';
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-icons">sync</span> Authenticating...';
    }

    // Redirect to appropriate dashboard based on selected role
    setTimeout(() => {
      if (roleVal === 'Compliance Manager') {
        window.location.href = 'compliance-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   SIGNUP FORM LOGIC
   -------------------------------------------------------------------------- */
function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const roleInput = document.getElementById('signupSelectedRole');
  const passwordInput = document.getElementById('signupPassword');
  const confirmPasswordInput = document.getElementById('signupConfirmPassword');

  const nameError = document.getElementById('signupNameError');
  const emailError = document.getElementById('signupEmailError');
  const roleError = document.getElementById('signupRoleError');
  const passwordError = document.getElementById('signupPasswordError');
  const confirmError = document.getElementById('signupConfirmError');
  const generalFeedback = document.getElementById('signupGeneralFeedback');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages
    if (nameError) { nameError.textContent = ''; nameError.style.display = 'none'; }
    if (emailError) { emailError.textContent = ''; emailError.style.display = 'none'; }
    if (roleError) { roleError.textContent = ''; roleError.style.display = 'none'; }
    if (passwordError) { passwordError.textContent = ''; passwordError.style.display = 'none'; }
    if (confirmError) { confirmError.textContent = ''; confirmError.style.display = 'none'; }
    if (generalFeedback) { generalFeedback.style.display = 'none'; }

    // 1. Full Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (nameError) {
        nameError.textContent = 'Full name is required.';
        nameError.style.display = 'block';
      }
      isValid = false;
    }

    // 2. Email (must be @gmail.com)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailVal) {
      if (emailError) {
        emailError.textContent = 'Email address is required.';
        emailError.style.display = 'block';
      }
      isValid = false;
    } else if (!gmailRegex.test(emailVal)) {
      if (emailError) {
        emailError.textContent = 'Email must follow Gmail format and end with @gmail.com.';
        emailError.style.display = 'block';
      }
      isValid = false;
    }

    // 3. Role (optional if role selector is present)
    const roleVal = roleInput ? roleInput.value.trim() : 'Compliance Officer';
    if (roleInput && !roleVal) {
      if (roleError) {
        roleError.textContent = 'Please select a compliance role.';
        roleError.style.display = 'block';
      }
      isValid = false;
    }

    // 4. Password (exactly 8 chars, alphanumeric)
    const passVal = passwordInput ? passwordInput.value : '';
    const passRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passVal) {
      if (passwordError) {
        passwordError.textContent = 'Password is required.';
        passwordError.style.display = 'block';
      }
      isValid = false;
    } else if (passVal.length !== 8) {
      if (passwordError) {
        passwordError.textContent = 'Password must be exactly 8 characters.';
        passwordError.style.display = 'block';
      }
      isValid = false;
    } else if (!passRegex.test(passVal)) {
      if (passwordError) {
        passwordError.textContent = 'Password must contain only letters and numbers (e.g. ABC12345).';
        passwordError.style.display = 'block';
      }
      isValid = false;
    }

    // 5. Confirm Password
    const confirmVal = confirmPasswordInput ? confirmPasswordInput.value : '';
    if (!confirmVal) {
      if (confirmError) {
        confirmError.textContent = 'Please confirm your password.';
        confirmError.style.display = 'block';
      }
      isValid = false;
    } else if (confirmVal !== passVal) {
      if (confirmError) {
        confirmError.textContent = 'Passwords do not match.';
        confirmError.style.display = 'block';
      }
      isValid = false;
    }

    if (!isValid) return;

    // Save temporary account
    const newUserData = {
      name: nameVal,
      email: emailVal,
      role: roleVal
    };
    localStorage.setItem('stackly_user', JSON.stringify(newUserData));

    if (generalFeedback) {
      generalFeedback.textContent = 'Account created successfully! Redirecting you to login...';
      generalFeedback.className = 'form-feedback success';
      generalFeedback.style.display = 'block';
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-icons">check_circle</span> Registered!';
    }

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });
}
