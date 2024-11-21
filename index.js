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
  const apiCallsInfo = document.getElementById("apiCallsInfo");
  const adminSection = document.getElementById("adminSection");
  const adminTableBody = document.getElementById("adminTableBody");
  const logoutBtn = document.getElementById("logoutBtn");
  const demoCard = document.getElementById("demoCard");
  const galleryCard = document.getElementById("galleryCard");

  // Set user info
  const isAdmin = userRole === "admin";
  userEmailDisplay.textContent = `${userEmail} (${userRole.toUpperCase()})`;
  welcomeMessage.textContent = `Welcome, ${userEmail}`;

  // Show admin section if admin
  if (isAdmin) {
    adminSection.style.display = "block";
    // temp
    // fetchAdminStats();
  }

  // temp
  apiCallsInfo.textContent = "API Calls Remaining: 20/20";

  // Event Listeners
  logoutBtn.addEventListener("click", handleLogout);

  galleryCard.addEventListener("click", () => {
    // to replace to gallery page
    fetch(`${config.API_BASE_URL}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  function handleLogout() {
    localStorage.clear();
    location.href = "login.html";
  }

  // temp
  if (isAdmin) {
    const exampleData = [
      { email: "user1@example.com", apiCalls: 5, lastActivity: new Date() },
      { email: "user2@example.com", apiCalls: 10, lastActivity: new Date() },
    ];
    updateAdminTable(exampleData);
  }

  function updateAdminTable(users) {
    if (!adminTableBody) return;

    adminTableBody.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.apiCalls || 0}</td>
                <td>${new Date(user.lastActivity).toLocaleDateString()}</td>
            `;
      adminTableBody.appendChild(row);
    });
  }
});
