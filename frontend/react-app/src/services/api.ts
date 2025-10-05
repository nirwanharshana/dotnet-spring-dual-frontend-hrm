import axios from "axios";

const api = axios.create({
  baseURL: "/", // The proxy handles the full URL
});

export default api;
