import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: { "Content-Type": "application/json", accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const token = parsed?.token;
      if (token) {
        config.headers = config.headers || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch { /* empty */ }
  }
  return config;
});

export default api;
