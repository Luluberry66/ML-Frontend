const config = {
  API_BASE_URL:
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://ml.grace-su.com",

  ENDPOINTS: {
    SIGNUP: "/signup",
    LOGIN: "/login",
    USERS: "/users",
    API_CALLS: "/api-calls",
    ACCOUNT: "/account",
    DELETE_ACCOUNT: "/delete-account",
    CHANGE_PASSWORD: "/change-password",
    GENERATE_IMAGE: "/generate-image",
  },
};
