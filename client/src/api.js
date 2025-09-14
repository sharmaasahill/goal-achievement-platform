import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? 
        (process.env.REACT_APP_API_URL.endsWith('/api') ? 
            process.env.REACT_APP_API_URL : 
            process.env.REACT_APP_API_URL + '/api') : 
        "http://localhost:5000/api",
});

// Debug: Log the API URL being used
console.log("API Base URL:", process.env.REACT_APP_API_URL || "http://localhost:5000/api");

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;