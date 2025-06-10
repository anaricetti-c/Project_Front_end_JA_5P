import axios from "axios";

export const api = axios.create({
  // baseURL: "https://project-backend-ja-5p.onrender.com/api"
  baseURL: "http://localhost:8000/api",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post(
          "/refresh_token",
          {},
          { withCredentials: true }
        );
        sessionStorage.setItem("@ACCESS_TOKEN", data.access_token);

        // Atualiza o Authorization do request original
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;

        // Reenvia o request original com o novo token
        return api(originalRequest);
      } catch (err) {
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
