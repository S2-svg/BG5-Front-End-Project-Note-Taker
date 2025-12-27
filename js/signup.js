function checkPasswordStrength() {
  const password = document.getElementById("password")?.value || "";
  const meter = document.getElementById("strengthMeter");
  const text = document.getElementById("strengthText");
  if (!meter || !text) return;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  let level = "";
  let color = "";
  let width = 0;

  if (score <= 1) {
    level = "Weak";
    color = "#dc3545";
    width = 25;
  } else if (score === 2) {
    level = "Fair";
    color = "#fd7e14";
    width = 50;
  } else if (score === 3) {
    level = "Good";
    color = "#ffc107";
    width = 75;
  } else {
    level = "Strong";
    color = "#28a745";
    width = 100;
  }
  meter.style.width = width + "%";
  meter.style.background = color;
  text.textContent = `Password strength: ${level}`;
}
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  if (!passwordInput) return;
  const icon = passwordInput.nextElementSibling?.querySelector("i");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    if (icon) icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    if (icon) icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}
function handleFormSubmit(e) {
  const form = e.target;
  const submitButton = form.querySelector(".btn");
  if (!submitButton) return;
  const originalText = submitButton.innerHTML;
  const wasDisabled = submitButton.disabled;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitButton.disabled = true;
  setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.disabled = wasDisabled;
  }, 3000);
}
function hideAlert(alertElement) {
  alertElement.style.opacity = "0";
  alertElement.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    alertElement.style.display = "none";
  }, 500);
}

function showAlert(type, message, containerSelector = "#alertContainer") {
  const container = document.querySelector(containerSelector) || document.body;
  const alert = document.createElement("div");
  const typeClass =
    type === "success"
      ? "alert-success"
      : type === "warning"
      ? "alert-warning"
      : type === "info"
      ? "alert-info"
      : "alert-error";
  alert.className = `alert ${typeClass}`;
  alert.setAttribute("role", "alert");
  const iconClass =
    type === "success"
      ? "fas fa-check-circle"
      : type === "info"
      ? "fas fa-info-circle"
      : "fas fa-exclamation-circle";
  alert.innerHTML = `
        <i class="${iconClass}"></i>
        <div>${message}</div>
        <button type="button" class="close-alert" aria-label="Close">&times;</button>
    `;
  container.prepend(alert);

  alert.querySelector(".close-alert").addEventListener("click", () => {
    hideAlert(alert);
  });

  setTimeout(() => {
    if (alert.style.display !== "none") hideAlert(alert);
  }, 5000);
  return alert;
}
function setupInputAnimations() {
  const inputs = document.querySelectorAll(".input-with-icon input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
    });
    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });
}
function setupSocialButtons() {
  const socialButtons = document.querySelectorAll(".btn-social");

  if (!window.firebase || !firebase.auth) {
    const socialSection = document.querySelector(".social-login");
    if (socialSection) socialSection.style.display = "none";
    return;
  }

  socialButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
    });
    button.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none";
    });
    button.addEventListener("click", function () {
      const provider = this.dataset.provider;
      if (!provider) return;
      signInWithProvider(provider);
    });
  });
}

function setupLoginFormValidation() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  const email = form.querySelector("#email");
  const password = form.querySelector("#password");
  const submit = form.querySelector('button[type="submit"]');
  if (!submit) return;

  function updateState() {
    const hasEmail = email && email.value && isValidEmail(email.value.trim());
    const hasPassword =
      password && password.value && password.value.length >= 6;
    submit.disabled = !(hasEmail && hasPassword);
  }

  updateState();
  email && email.addEventListener("input", updateState);
  password && password.addEventListener("input", updateState);

  form.addEventListener("submit", function (e) {
    if (submit.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showAlert(
        "error",
        "Please enter a valid email and password (minimum 6 characters)."
      );
      return false;
    }
  });
}

async function signInWithProvider(providerName) {
  if (!window.firebase || !firebase.auth) {
    showAlert("error", "Social login is not available on this page.");
    return;
  }

  let provider;
  try {
    if (providerName === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (providerName === "github") {
      provider = new firebase.auth.GithubAuthProvider();
    } else {
      showAlert("error", "Unknown social provider: " + providerName);
      return;
    }
  } catch (err) {
    console.error("Provider creation failed:", err);
    showAlert(
      "error",
      "Social login is not available: provider initialization failed."
    );
    return;
  }

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    const email =
      (user && user.email) ||
      (user.providerData &&
        user.providerData[0] &&
        user.providerData[0].email) ||
      "";
    if (!email) {
      showAlert("error", "Could not obtain email from provider.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    let existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!existing) {
      const newUser = {
        id: user.uid || Date.now().toString(),
        name: user.displayName || "",
        email,
        passwordHash: "",
        provider: providerName,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      existing = newUser;
    }

    localStorage.setItem("currentUser", existing.email);
    showAlert("success", `Signed in with ${providerName} — redirecting...`);
    const nextFromUrl = sanitizeNextUrl(
      new URLSearchParams(location.search).get("next") || "index.html"
    );
    setTimeout(() => (location.href = nextFromUrl), 900);
  } catch (err) {
    console.error("Social sign-in failed:", err);
    const code = err && err.code ? err.code : null;
    const codePart = code ? ` (${code})` : "";

    if (
      code === "auth/popup-blocked" ||
      code === "auth/operation-not-supported-in-this-environment" ||
      code === "auth/popup-closed-by-user"
    ) {
      try {
        showAlert(
          "info",
          "Popup blocked or not supported — attempting redirect sign-in..."
        );
        await firebase.auth().signInWithRedirect(provider);
        return;
      } catch (redirErr) {
        console.error("Redirect sign-in failed:", redirErr);
        showAlert(
          "error",
          "Redirect sign-in failed: " +
            (redirErr.message || redirErr) +
            (redirErr.code ? ` (${redirErr.code})` : "")
        );
        return;
      }
    }

    if (code === "auth/unauthorized-domain") {
      showAlert(
        "error",
        "Sign-in blocked: unauthorized domain. Add this domain to Firebase Console > Authentication > Authorized domains."
      );
      return;
    }

    showAlert(
      "error",
      "Social sign-in failed: " + (err.message || err) + codePart
    );
  }
}
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function sanitizeNextUrl(next) {
  if (!next) return "index.html";
  try {
    const lower = String(next).toLowerCase();
    if (
      lower.includes("signup") ||
      lower.includes("singup") ||
      lower.includes("signin")
    ) {
      return "index.html";
    }

    if (lower.startsWith("javascript:") || lower.startsWith("data:"))
      return "index.html";
    return next;
  } catch (err) {
    return "index.html";
  }
}
function isValidPassword(password) {
  return password.length >= 6;
}
function initializePage() {
  console.log("Initializing auth page...");
  setupInputAnimations();
  if (document.querySelector(".btn-social")) {
    checkFirebaseAvailability();
    setupSocialButtons();
  }
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength);
  }
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
  });

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleRegisterSubmit(e);
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      handleLoginSubmit(e);
    });

    setupLoginFormValidation();
  }
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert.style.display !== "none") {
        hideAlert(alert);
      }
    }, 5000);
  });
  console.log("Auth page initialized!");

  const urlParams = new URLSearchParams(location.search);
  const nextParam = urlParams.get("next");
  const createdParam = urlParams.get("created");
  if (createdParam) {
    showAlert("success", "Account created successfully. Please sign in.");
  }
  if (nextParam) {
    showAlert("info", `Please sign in or register to continue to ${nextParam}`);
  }
}
document.addEventListener("DOMContentLoaded", initializePage);
window.passwordUtils = {
  checkPasswordStrength,
  togglePassword,
  isValidEmail,
  isValidPassword,
};

async function hashString(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function checkFirebaseAvailability() {
  const socialSection = document.querySelector(".social-login");
  const noticeEl = document.getElementById("socialNotice");
  try {
    if (
      typeof window.firebaseInitialized !== "undefined" &&
      !window.firebaseInitialized
    ) {
      if (noticeEl) {
        noticeEl.style.display = "block";
        noticeEl.className = "alert alert-info";
        noticeEl.textContent =
          "Firebase is not configured. To enable Google/GitHub sign-in, paste your Firebase config into static/JS/firebase-init.js and enable providers in Firebase Console.";
      } else {
        showAlert(
          "warning",
          "Firebase not configured — social sign-in disabled."
        );
      }
      if (socialSection) socialSection.style.display = "none";
      return false;
    }

    if (
      typeof window.firebaseAvailable !== "undefined" &&
      !window.firebaseAvailable
    ) {
      if (noticeEl) {
        noticeEl.style.display = "block";
        noticeEl.className = "alert alert-warning";
        noticeEl.innerHTML =
          "Firebase Auth is not available. Ensure you included <code>firebase-auth-compat.js</code> and enabled providers in the Firebase console.";
      } else {
        showAlert(
          "warning",
          "Firebase Auth not available — social sign-in disabled."
        );
      }
      if (socialSection) socialSection.style.display = "none";
      return false;
    }

    if (!window.firebase || !firebase.auth) {
      if (noticeEl) {
        noticeEl.style.display = "block";
        noticeEl.className = "alert alert-warning";
        noticeEl.innerHTML =
          "Firebase SDK appears missing or misloaded. Check browser console for details.";
      } else {
        showAlert(
          "warning",
          "Firebase SDK not found — social sign-in is disabled."
        );
      }
      if (socialSection) socialSection.style.display = "none";
      return false;
    }

    try {
      new firebase.auth.GoogleAuthProvider();
      new firebase.auth.GithubAuthProvider();
    } catch (err) {
      console.warn("Provider instantiation failed:", err);
      if (noticeEl) {
        noticeEl.style.display = "block";
        noticeEl.className = "alert alert-warning";
        noticeEl.innerHTML =
          "Social providers cannot be initialized. Check your Firebase project settings and make sure the providers (Google, GitHub) are enabled.";
      } else {
        showAlert(
          "warning",
          "Social providers are not available. Check Firebase config/provider setup."
        );
      }
      if (socialSection) socialSection.style.display = "none";
      return false;
    }

    if (noticeEl) {
      noticeEl.style.display = "none";
    }

    return true;
  } catch (err) {
    console.error("Firebase availability check error:", err);
    if (noticeEl) {
      noticeEl.style.display = "block";
      noticeEl.className = "alert alert-warning";
      noticeEl.textContent =
        "Social sign-in disabled due to an unexpected error (see console).";
    }
    if (socialSection) socialSection.style.display = "none";
    return false;
  }
}

async function handleRegisterSubmit(e) {
  const form = document.getElementById("registerForm");
  if (!form) return;
  const name = form.querySelector("#fullName")?.value.trim() || "";
  const email = form.querySelector("#email")?.value.trim() || "";
  const password = form.querySelector("#password")?.value || "";
  const confirm = form.querySelector("#confirmPassword")?.value || "";
  const terms = form.querySelector("#terms")?.checked || false;

  if (name.length < 2) {
    showAlert("error", "Please enter your full name.");
    form.querySelector("#fullName").focus();
    return;
  }
  if (!isValidEmail(email)) {
    showAlert("error", "Please provide a valid email address.");
    form.querySelector("#email").focus();
    return;
  }
  if (!isValidPassword(password)) {
    showAlert("error", "Password must be at least 6 characters.");
    form.querySelector("#password").focus();
    return;
  }
  if (password !== confirm) {
    showAlert("error", "Passwords do not match.");
    form.querySelector("#confirmPassword").focus();
    return;
  }
  if (!terms) {
    showAlert("error", "You must agree to the Terms and Privacy Policy.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showAlert("error", "An account with this email already exists.");
    return;
  }

  handleFormSubmit({ target: form });

  try {
    const passwordHash = await hashString(password);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    try {
      localStorage.setItem("currentUser", newUser.email);
      localStorage.setItem("offlineMode", "false");
    } catch (err) {
      console.warn("Could not persist session after registration:", err);
    }

    setTimeout(() => {
      showAlert("success", "Account created and signed in — redirecting...");

      form.reset();
      const meter = document.getElementById("strengthMeter");
      const text = document.getElementById("strengthText");
      if (meter) meter.style.width = "0%";
      if (text) text.textContent = "Password strength:";

      let nextFromUrl =
        new URLSearchParams(location.search).get("next") || "index.html";
      nextFromUrl = sanitizeNextUrl(nextFromUrl);
      setTimeout(() => {
        location.href = nextFromUrl;
      }, 900);
    }, 700);
  } catch (err) {
    console.error(err);
    showAlert("error", "An unexpected error occurred. Please try again.");
  }
}

async function handleLoginSubmit(e) {
  const form = document.getElementById("loginForm");
  if (!form) return;
  const email = form.querySelector("#email")?.value.trim() || "";
  const password = form.querySelector("#password")?.value || "";

  if (!isValidEmail(email)) {
    showAlert("error", "Please provide a valid email address.");
    form.querySelector("#email").focus();
    return;
  }
  if (!isValidPassword(password)) {
    showAlert("error", "Password must be at least 6 characters.");
    form.querySelector("#password").focus();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    showAlert("error", "No account found for this email.");
    return;
  }
  try {
    const passwordHash = await hashString(password);
    if (passwordHash !== user.passwordHash) {
      showAlert("error", "Invalid email or password.");
      return;
    }

    handleFormSubmit({ target: form });
    localStorage.setItem("currentUser", user.email);
    showAlert("success", "Signed in — redirecting...");
    let nextFromUrl =
      new URLSearchParams(location.search).get("next") || "index.html";
    nextFromUrl = sanitizeNextUrl(nextFromUrl);
    setTimeout(() => {
      location.href = nextFromUrl;
    }, 800);
  } catch (err) {
    console.error(err);
    showAlert("error", "An unexpected error occurred. Please try again.");
  }
}
