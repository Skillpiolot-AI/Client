// src/config.js

const config = {
  // Base URL for API requests - uses environment variables with fallbacks
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  API_BASE_URL1: import.meta.env.VITE_API_BASE_URL1 || import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001"
};

export default config;
