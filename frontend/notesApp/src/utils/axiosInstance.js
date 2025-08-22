import { BASE_URL } from "./constants"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "https://notesmanagerapp.onrender.com",
    // If the request takes more than 10 seconds, it will fail.
    timeout: 10000,
    // Every request is sent as JSON.
    headers: {
        "Content-type": "application/json"
    },
});

// Automatically attach your auth token to every request.
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosInstance