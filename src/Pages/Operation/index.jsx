import { useState, useContext, useEffect } from "react";
import qs from "qs";

import { getHeaders } from "../../services/headers";
import { api } from "../../services/api";

export default function Operation() {
  const [loading, setLoading] = useState(false);
  const [molds, setMolds] = useState([]);

  useEffect(() => {
    fetchMolds();
  }, []);

  async function fetchMolds() {
    setLoading(true);
    try {
      const moldsResponse = await api.get(`/operation/all`, {
        headers: getHeaders(),
        params: {
          associations: ["machine"],
          page: 1,
          limit: 10,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(moldsResponse.data);
      setMolds(moldsResponse.data.data);
    } catch (error) {
      console.error("Error fetching molds:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMolds() {
    if (Array.isArray(molds) && molds.length > 0) {
      return molds.map((m, index) => {
        const dateString = m.created_at;
        const date = new Date(dateString);
        const creation_date = date.toLocaleDateString("pt-BR");
        const maquina =
          m.machine !== null ? m.machine.m_type : 'Operação Manual';
        return (
          <tr key={index}>
            <td>{m.name}</td>
            <td>{m.op_type}</td>
            <td>{maquina}</td>
            <td>{creation_date}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={7} className="text-center py-4">
            Nenhuma operação cadastrada.
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
              <th>Nome</th>
              <th>Maquina</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>{!loading && getMolds()}</tbody>
        </table>
      </div>
    </main>
  );
}
