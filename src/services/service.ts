import axios from "axios";

export const SERVICE_API_URL =
  "https://lumbar-mora-uncoroneted.ngrok-free.dev/api";

export const connector = axios.create({
  baseURL: SERVICE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const connectorFile = axios.create({
  baseURL: SERVICE_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

connector.interceptors.request.use(
  async (config) => {
    try {
      const token = await localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.log("Interceptor Error (request):", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.log("Interceptor Error (config):", error);
    return Promise.reject(error);
  }
);

connectorFile.interceptors.request.use(
  async (config) => {
    try {
      const token = await localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.log("Interceptor Error (request):", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.log("Interceptor Error (config):", error);
    return Promise.reject(error);
  }
);
