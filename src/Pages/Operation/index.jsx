import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchOperations(page);
    }
  }, [search]);

  async function fetchOperations(page) {
    setLoading(true);
    try {
      const operationsResponse = await api.get(`/operation/all`, {
        headers: getHeaders(),
        params: {
          associations: ["machine"],
          page: page,
          limit: 10,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      setTotal(operationsResponse.data.metadata.total);
      console.log(operationsResponse.data);
      setOperations(operationsResponse.data.data);
    } catch (error) {
      console.error("Error fetching operations:", error);
    } finally {
      setLoading(false);
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
              <img src="delete.png" alt="Deletar" className="icon" />
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={5}>Nenhuma operação cadastrada.</td>
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
        filters={"operations"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        columns={["Código", "Nome", "Máquina", "Data de Criação", ""]}
      />
    </main>
  );
}
