import { useState, useContext, useEffect } from "react";
import "./style.css";
import qs from "qs";

import { getHeaders } from "../../Services/headers";
import { api } from "../../Services/api";

export default function Part() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetchParts();
  }, []);

  async function fetchParts() {
    setLoading(true);
    try {
      const partsResponse = await api.get(`/part/all`, {
        headers: getHeaders(),
        params: {
          associations: ["mold", "operation_associations", "material_associations"],
          page: 1,
          limit: 10,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(partsResponse.data);
      setParts(partsResponse.data.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  }

  function getParts() {
    if (Array.isArray(parts) && parts.length > 0) {
      return parts.map((p, index) => {
        const status = p.status === 'In Progress' ? 'progress' : p.status.toLowerCase();
        let material_associations = p.material_associations; // valor padrão
        let material = "Pending"; // valor padrão

        if (material_associations.some(p => p.status === "Pending")) {
          material = "Pending";
        } else if (material_associations.some(p => p.status === "Available")) {
          material = "Available";
        }
        return (
          <tr key={index}>
            <td>{p.mold.name}</td>
            <td>{p.name}</td>
            <td className=".description-column">
              {p.description ? p.description : "Sem descrição"}
            </td>
            
            <td>
              <span className={`status status-${p.nc_program.toLowerCase()}`}>
                {p.nc_program}
              </span>
            </td>
            <td>
              <span className={`status status-${p.model_3d.toLowerCase()}`}>
                {p.model_3d}
              </span>
            </td>
            <td>
              <span className={`status status-${material.toLowerCase()}`}>
                {material}
              </span>
            </td>
            <td>{p.progress_percentage}%</td>
            <td>
              <span className={`status status-${status}`}>
                {p.status}
              </span>
            </td>
            
            <td>{p.quantity}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={7} className="text-center py-4">
            Nenhuma peça cadastrada.
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
              <th>Molde</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Modelo 3D</th>
              <th>Programa NC</th>
              <th>Materiais</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Quantidade</th>

              {/* <th>Código</th>
              <th>Código do Molde</th> */}
            </tr>
          </thead>
          <tbody>{!loading && getParts()}</tbody>
        </table>
      </div>
    </main>
  );
}
