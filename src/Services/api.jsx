import axios from "axios";

export const api = axios.create({
  // baseURL: "https://project-backend-ja-5p.onrender.com/api"
  baseURL: "http://localhost:8000/api",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post(
          "/refresh_token",
          {},
          { withCredentials: true }
        );

        sessionStorage.setItem("@ACCESS_TOKEN", data.access_token);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access_token}`,
        };

        return api.request(originalRequest);
      } catch (err) {
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

