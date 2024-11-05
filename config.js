const config = {
    API_BASE_URL:
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "localhost"
        ? "http://localhost:3000" 
        : "https://ml.grace-su.com", 

  // PATHS
    PATHS: {
        LOGIN: "login.html",
        HOME: "home.html",
        DEMO: "demo",
        GALLERY: "gallery",
    },
};
