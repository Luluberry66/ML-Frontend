document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  const token = localStorage.getItem("token");
  
  if (token) {
    location.href = "index.html";
    return;
  }

  // DOM Elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const authForm = document.getElementById("authForm");
  const usernameField = document.getElementById("usernameField");
  const submitButton = document.getElementById("submitButton");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  let isLogin = true;

  // Event Listeners
  loginTab.addEventListener("click", () => switchMode(true));
  signupTab.addEventListener("click", () => switchMode(false));
  authForm.addEventListener("submit", handleAuth);

  function switchMode(login) {
    isLogin = login;
    loginTab.classList.toggle("active", login);
    signupTab.classList.toggle("active", !login);
    usernameField.style.display = login ? "none" : "block";
    submitButton.textContent = login ? "Login" : "Sign Up";
    errorMessage.style.display = "none";
    successMessage.style.display = "none";
    authForm.reset(); // Clear form when switching modes
  }

  async function handleAuth(e) {
    e.preventDefault();
    const formData = new FormData(authForm);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    // Validate required fields
    if (!isLogin && !username) {
      showErrorMessage("Username is required for signup");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    try {
      const endpoint = `${config.API_BASE_URL}${
        isLogin ? config.ENDPOINTS.LOGIN : config.ENDPOINTS.SIGNUP
      }`;

      const body = isLogin
        ? { email, password }
        : { username, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", data.role || "user");
            location.href = "index.html";
          }
        } else {
          showSuccessMessage("Signup successful! Please login.");
          setTimeout(() => {
            switchMode(true);
          }, 1500);
        }
      } else {
        showErrorMessage(data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      showErrorMessage("Unable to connect to the server. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = isLogin ? "Login" : "Sign Up";
    }
  }

  function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
  }

  function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
  }
});
