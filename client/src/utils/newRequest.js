import axios from "axios";

const newRequest = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://localhost:5000/api",
  withCredentials: true,
});

export default newRequest;