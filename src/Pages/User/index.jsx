import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/user/all", {
          headers: getHeaders(),
        });
        setUsers(response.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className={styles.container}>
      <h1>Usuários</h1>
      <div className={styles.cardGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.card}>
            <h2>{user.full_name}</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Matrícula:</strong> {user.registration_number}
            </p>
            <p>
              <strong>Cargo:</strong> {user.role}
            </p>
            <p className={styles.createdAt}>
              <small>
                Criado em: {new Date(user.created_at).toLocaleDateString()}
              </small>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
