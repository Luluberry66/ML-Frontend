document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  if (!token || !userEmail) {
    location.href = "login.html";
    return;
  }

  // DOM Elements
  const userEmailDisplay = document.getElementById("userEmailDisplay");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const adminSection = document.getElementById("adminSection");
  const userSection = document.getElementById("userSection");
  const galleryCard = document.getElementById("galleryCard");
  const logoutBtn = document.getElementById("logoutBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");

  // Extract username from email
  const username = userEmail.split("@")[0];

  // Set user info
  const isAdmin = userRole && userRole.toLowerCase() === "admin";
  userEmailDisplay.textContent = `${username} (${
    userRole ? userRole.toUpperCase() : "USER"
  })`;
  welcomeMessage.textContent = `Welcome, ${username}`;

  // Show/hide sections based on role
  if (isAdmin) {
    adminSection.style.display = "block";
    loadAdminData();
  } else {
    adminSection.style.display = "none";
  }
  userSection.style.display = "block";
  loadUserData();

  async function loadAdminData() {
    try {
      // Fetch API stats
      const apiStatsResponse = await fetch(
        `${config.API_BASE_URL}${config.ENDPOINTS.API_CALLS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!apiStatsResponse.ok) {
        throw new Error("Failed to fetch API stats");
      }

      const apiStats = await apiStatsResponse.json();
      updateApiStatsTable(apiStats);

      // Fetch user stats
      const userStatsResponse = await fetch(
        `${config.API_BASE_URL}${config.ENDPOINTS.USERS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userStatsResponse.ok) {
        throw new Error("Failed to fetch user stats");
      }

      const userStats = await userStatsResponse.json();
      updateUserStatsTable(userStats);
    } catch (error) {
      console.error("Error loading admin data:", error);
      showError("Failed to load admin data. Please try again later.");
    }
  }

  async function loadUserData() {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}${config.ENDPOINTS.ACCOUNT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch account data");
      }

      const userData = await response.json();
      updateUserApiStats(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      showError("Failed to load user data. Please try again later.");
    }
  }

  function updateApiStatsTable(data) {
    const tableBody = document.getElementById("apiStatsTableBody");
    if (!tableBody) {
      console.error("API stats table body not found");
      return;
    }

    const endpoints = [
      { method: "POST", path: "/signup" },
      { method: "POST", path: "/login" },
      { method: "POST", path: "/generate-image" },
      { method: "GET", path: "/users" },
      { method: "GET", path: "/api-calls" },
      { method: "GET", path: "/account" },
      { method: "DELETE", path: "/delete-account" },
      { method: "PUT", path: "/change-password" },
    ];

    const rows = endpoints.map((endpoint) => {
      const stats = data.find(
        (stat) =>
          stat.method === endpoint.method && stat.endpoint === endpoint.path
      ) || { requests: 0 };

      return `
        <tr>
          <td>${endpoint.method}</td>
          <td>${endpoint.path}</td>
          <td>${stats.requests || 0}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows.join("");
  }

  function updateUserStatsTable(users) {
    const tableBody = document.getElementById("userStatsTableBody");
    if (!tableBody) {
      console.error("User stats table body not found");
      return;
    }

    if (!Array.isArray(users)) {
      console.error("Expected users data to be an array");
      return;
    }

    const rows = users.map((user) => {
      const username = user.email.split("@")[0];
      return `
        <tr>
          <td>${username}</td>
          <td>${user.email}</td>
          <td>${user.totalRequests || 0}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows.join("");
  }

  function updateUserApiStats(data) {
    const lastActivity = data.lastActivity
      ? new Date(data.lastActivity).toLocaleString()
      : "No activity";
    const userApiStats = document.getElementById("userApiStats");
    userApiStats.innerHTML = `
      <p>Total API Requests: ${data.totalRequests || 0}</p>
      <p>Last Activity: ${lastActivity}</p>
    `;
  }

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    document.querySelector(".main-content").prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  // Event Listeners
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    location.href = "login.html";
  });

  deleteAccountBtn.addEventListener("click", async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${config.API_BASE_URL}${config.ENDPOINTS.DELETE_ACCOUNT}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.clear();
      location.href = "login.html";
    } catch (error) {
      console.error("Error deleting account:", error);
      showError("Failed to delete account. Please try again later.");
    }
  });

  changePasswordBtn.addEventListener("click", async () => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    try {
      const response = await fetch(
        `${config.API_BASE_URL}${config.ENDPOINTS.CHANGE_PASSWORD}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      showError("Failed to change password. Please try again later.");
    }
  });

  // Gallery Card click event
  galleryCard.addEventListener("click", () => {
    location.href = "gallery.html";
  });
});
