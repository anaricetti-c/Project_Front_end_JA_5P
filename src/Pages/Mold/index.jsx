import { useState, useContext, useEffect } from "react";
import "./style.css";
import qs from "qs";

import { getHeaders } from "../../Services/headers";
import { api } from "../../Services/api";

export default function Mold() {
  const [loading, setLoading] = useState(false);
  const [molds, setMolds] = useState([]);

  useEffect(() => {
    fetchMolds();
  }, []);

  async function fetchMolds() {
    setLoading(true);
    try {
      const moldsResponse = await api.get(`/mold/all`, {
        headers: getHeaders(),
        params: {
          associations: ['customer', 'created_by'],
          page: 1,
          limit: 10,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(moldsResponse.data);

      const priorityOrder = {
        Urgent: 1,
        High: 2,
        Medium: 3,
        Low: 4,
      };

      const sortedMolds = [...moldsResponse.data.data].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      setMolds(sortedMolds);
    } catch (error) {
      console.error("Error fetching molds:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMolds() {
    if (Array.isArray(molds) && molds.length > 0) {
      return molds.map((m, index) => {
        const dateString = m.delivery_date;
        const date = new Date(dateString);
        const delivery_date_formatted = date.toLocaleDateString("pt-BR");
        const status =
          m.status === "In Progress" ? "progress" : m.status.toLowerCase();
        return (
          <tr key={index}>
            <td>{m.name}</td>
            <td>
              {m.customer.full_name} {m.customer.country_name}
            </td>
            <td>
              <span className={`priority priority-${m.priority.toLowerCase()}`}>
                {m.priority}
              </span>
            </td>
            <td>{delivery_date_formatted}</td>
            <td>
              <span className={`status status-${status}`}>{m.status}</span>
            </td>
            <td>{m.progress_percentage}%</td>
            <td>{m.quantity}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={7} className="text-center py-4">
            Nenhum molde cadastrado.
          </td>
        </tr>
      );
    }
  }

  return (
    <main>
      <div className="container">
        <div className="actions">
          <button className="button adicionar">Adicionar</button>
          <button className="button importar">Importar</button>
          <button className="button relatorios">Relatórios</button>
          <div className="search-bar">
            <input type="text" placeholder="" />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="search-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Prioridade</th>
              <th>Prazo</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>{!loading && getMolds()}</tbody>
        </table>
      </div>
    </main>
  );
}
