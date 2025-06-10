import qs from "qs";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";
import DeleteModal from "../../components/DeleteModal";

export default function Part() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [partToDelete, setPartToDelete] = useState(null);
  const navigate = useNavigate();

  function handleDeleteClick(mold) {
    setPartToDelete(mold);
  }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchParts(page);
    }
  }, [search]);

  async function fetchParts(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        associations: [
          "mold",
          "operation_associations",
          "material_associations",
          "nc_program",
          "model_3d",
        ],
        limit: pageSize,
        page: page,
      };

      if (field && value) {
        requestParams.field = `part.${field}`;
        requestParams.value = value;

        // // Limpa os parâmetros da URL
        // setSearch((prev) => {
        //   const newParams = new URLSearchParams(prev);
        //   newParams.delete("field");
        //   newParams.delete("value");
        //   return newParams;
        // });
      }

      const partsResponse = await api.get(`/part/all`, {
        headers: getHeaders(),
        params: requestParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(partsResponse.data);
      setTotal(partsResponse.data.metadata.total);
      setParts(partsResponse.data.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeletePart() {
    try {
      await api.delete(`/part/delete/${partToDelete.id}`, {
        headers: getHeaders(),
      });

      const currentPage = Number(search.get("page")) || 1;
      const newTotal = total - 1;

      const maxPage = Math.ceil(newTotal / pageSize);
      const newPage = currentPage > maxPage ? maxPage : currentPage;

      setSearch((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", newPage);
        newParams.set("refresh", Date.now().toString());
        return newParams;
      });

      setPartToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar peça:", error);
      toast.error("Erro ao deletar peça.");
    }
  }

  function getParts() {
    if (Array.isArray(parts) && parts.length > 0) {
      return parts.map((p, index) => {
        const status =
          p.status === "In Progress" ? "progress" : p.status.toLowerCase();
        let material_associations = p.material_associations;
        let material = "Pending";

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
            <td>
              <span className={`status status-${status}`}>{p.status}</span>
            </td>
            <td>{p.quantity}</td>
            <td>
              <img
                onClick={() => navigate(`/part/${p.id}`)}
                src="details.png"
                alt="Detalhes"
                className="icon"
              />
            </td>
            <td>
              <img
                onClick={() => handleDeleteClick(p)}
                src="delete.png"
                alt="Deletar"
                className="icon"
              />
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={10}>Nenhuma peça cadastrada.</td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        tableName="Peças"
        total={total}
        loading={loading}
        getEntities={getParts}
        search={search}
        setSearch={setSearch}
        filters={"part"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setPageSize={setPageSize}
        pageSize={pageSize}
        columns={[
          "Molde",
          "Nome",
          "Descrição",
          "Programa NC",
          "Modelo 3D",
          "Materiais",
          // "Progresso",
          "Status",
          "Quantidade",
          "",
          "",
        ]}
      />
      <DeleteModal
        confirmDeleteEntity={confirmDeletePart}
        setEntityToDelete={setPartToDelete}
        entityToDelete={partToDelete}
        entityName={"a peça"}
      />
    </main>
  );
}
