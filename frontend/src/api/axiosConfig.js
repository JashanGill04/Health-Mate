import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE==="development" ? "http://localhost:5000/api": "/api",
  withCredentials: true // ✅ send cookies with every request
});

export default axiosInstance;
