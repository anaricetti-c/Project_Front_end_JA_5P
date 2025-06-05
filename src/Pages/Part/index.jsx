import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../Services/api";
import { getHeaders } from "../../Services/headers";
import PaginatedTable from "../../Components/PaginatedTable";

export default function Part() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    if (!search.get("page")) {
      setSearch({ page: "1" });
    }
  }, [search, setSearch]);

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchParts(page);
    }
  }, [search]);

  async function fetchParts(page) {
    setLoading(true);
    try {
      const partsResponse = await api.get(`/part/all`, {
        headers: getHeaders(),
        params: {
          associations: [
            "mold",
            "operation_associations",
            "material_associations",
            "nc_program",
            "model_3d",
          ],
          page: page,
          limit: 15,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      setTotal(partsResponse.data.metadata.total);
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
        const status =
          p.status === "In Progress" ? "progress" : p.status.toLowerCase();
        let material_associations = p.material_associations; // valor padrão
        let material = "Pending"; // valor padrão

        if (material_associations.some((p) => p.status === "Pending")) {
          material = "Pending";
        } else if (
          material_associations.some((p) => p.status === "Available")
        ) {
          material = "Available";
        }
        const nc_status = p.nc_program !== null ? "available" : "pending";
        const model_3d_status = p.model_3d !== null ? "available" : "pending";

        return (
          <tr key={index}>
            <td>{p.mold.name}</td>
            <td>{p.name}</td>
            <td className="description-column">
              {p.description ? p.description : "Sem descrição"}
            </td>

            <td>
              <span className={`status status-${nc_status}`}>{nc_status}</span>
            </td>
            <td>
              <span className={`status status-${model_3d_status}`}>
                {model_3d_status}
              </span>
            </td>
            <td>
              <span className={`status status-${material.toLowerCase()}`}>
                {material}
              </span>
            </td>
            <td>{p.progress_percentage}%</td>
            <td>
              <span className={`status status-${status}`}>{p.status}</span>
            </td>

            <td>{p.quantity}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={9} className="text-center py-4">
            Nenhuma peça cadastrada.
          </td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        total={total}
        loading={loading}
        getEntities={getParts}
        search={search}
        setSearch={setSearch}
        filters={"part"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        columns={[
          "Molde",
          "Nome",
          "Descrição",
          "Programa NC",
          "Modelo 3D",
          "Materiais",
          "Status",
          "Progresso",
          "Quantidade",
        ]}
      />
    </main>
  );
}
