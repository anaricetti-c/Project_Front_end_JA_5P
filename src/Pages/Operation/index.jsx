import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";

export default function Operation() {
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [operationToDelete, setOperationToDelete] = useState(null);
  const navigate = useNavigate();

  function handleDeleteClick(mold) {
    setOperationToDelete(mold);
  }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchOperations(page);
    }
  }, [search]);

  async function fetchOperations(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        associations: ["machine"],
        limit: pageSize,
        page: page,
      };

      if (field && value) {
        requestParams.field = `operation.${field}`;
        requestParams.value = value;
      }

      const operationsResponse = await api.get(`/operation/all`, {
        headers: getHeaders(),
        params: requestParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(operationsResponse.data);
      setTotal(operationsResponse.data.metadata.total);
      setOperations(operationsResponse.data.data);
    } catch (error) {
      console.error("Error fetching operations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteOperation() {
    try {
      await api.delete(`/operation/delete/${operationToDelete.id}`, {
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

      setOperationToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar operação:", error);
      toast.error("Erro ao deletar operação.");
    }
  }

  function getOperations() {
    if (Array.isArray(operations) && operations.length > 0) {
      return operations.map((op, index) => {
        const dateString = op.created_at;
        const date = new Date(dateString);
        const creation_date = date.toLocaleDateString("pt-BR");
        const machine =
          op.machine !== null ? op.machine.m_type : "Operação Manual";
        return (
          <tr key={index}>
            <td>{op.name}</td>
            <td>{op.op_type}</td>
            <td>{machine}</td>
            <td>{creation_date}</td>
            <td>
              <img
                onClick={() => navigate(`/operation/${op.id}`)}
                src="details.png"
                alt="Detalhes"
                className="icon"
              />
            </td>
            <td>
              <img
                onClick={() => handleDeleteClick(op)}
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
          <td colSpan={6}>Nenhuma operação cadastrada.</td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        total={total}
        loading={loading}
        getEntities={getOperations}
        search={search}
        setSearch={setSearch}
        filters={"operation"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setPageSize={setPageSize}
        pageSize={pageSize}
        columns={["Código", "Nome", "Máquina", "Data de Criação", "", ""]}
      />
    </main>
  );
}
