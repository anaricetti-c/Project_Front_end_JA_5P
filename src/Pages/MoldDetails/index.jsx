import styles from "./style.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";

export default function MoldDetails() {
  const { id } = useParams(); // ID do molde na URL
  const [mold, setMold] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoldDetails() {
      try {
        const response = await api.get(`/mold/${id}`, {
          headers: getHeaders(),
        });
        setMold(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar molde:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMoldDetails();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!mold) return <p>Molde não encontrado.</p>;

  return (
    <div className={styles.container}>
      <h1>Molde {mold.name}</h1>

      <section className={styles.section}>
        <h2>Informações Gerais</h2>
        <p><strong>Status:</strong> {mold.status}</p>
        <p><strong>Prioridade:</strong> {mold.priority}</p>
        <p><strong>Data de Entrega:</strong> {new Date(mold.delivery_date).toLocaleDateString()}</p>
        <p><strong>Progresso:</strong> {mold.progress_percentage}%</p>
        <p><strong>Quantidade:</strong> {mold.quantity}</p>
      </section>
      

      <section className={styles.section}>
        <h2>Partes do Molde</h2>
        {mold.mold_parts.length === 0 ? (
          <p>Sem partes associadas.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {mold.mold_parts.map((part) => (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  <td>{part.description || "Sem descrição"}</td>
                  <td>{part.status}</td>
                  <td>{part.progress_percentage}%</td>
                  <td>{part.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.section}>
        <h2>Operações</h2>
        {mold.operation_associations.length === 0 ? (
          <p>Nenhuma operação registrada.</p>
        ) : (
          <ul>
            {mold.operation_associations.map((op) => (
              <li key={op.id}>
                <strong>ID:</strong> {op.operation_id} - <strong>Status:</strong> {op.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
