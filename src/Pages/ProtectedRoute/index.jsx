import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import AccessDenied from "../AccessDenied";
import { api } from "../../Services/api";

export default function ProtectedRoute({ targetPage }) {
  const [authorized, setAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const verifyAuth = async () => {
      const token = sessionStorage.getItem("@ACCESS_TOKEN");

      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        const { exp } = jwtDecode(token);
        const expired = Date.now() >= exp * 1000;

        if (expired) {
          const response = await api.post("/refresh_token", {}, { withCredentials: true });
          const newToken = response.data.access_token;
          sessionStorage.setItem("@ACCESS_TOKEN", newToken);
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Erro ao verificar token:", err);
        setAuthorized(false);
      }
    };

    verifyAuth();
  }, []);

  if (authorized === null) return <div>Carregando...</div>; // ou um Spinner bonitinho
  if (authorized === false) return <AccessDenied />;

  return targetPage;
}
