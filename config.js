const config = {
    API_BASE_URL:
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
        ? "http://localhost:3000" 
        : "https://ml.grace-su.com", 

  // PATHS
    PATHS: {
        LOGIN: "login.html",
        HOME: "index.html",
        DEMO: "demo",
        GALLERY: "gallery",
    },
};

const refreshAccessToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const response = await fetch(`${config.API_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        location.href = config.PATHS.LOGIN;
    }
};