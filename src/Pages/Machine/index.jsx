import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";

export default function Machine() {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchMachines(page);
    }
  }, [search]);

  async function fetchMachines(page) {
    setLoading(true);
    try {
      const machinesResponse = await api.get(`/machine/all`, {
        headers: getHeaders(),
        params: {
          // associations: ["machine"],
          page: page,
          limit: 10,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      setTotal(machinesResponse.data.metadata.total);
      console.log(machinesResponse.data);
      setMachines(machinesResponse.data.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMachines() {
    if (Array.isArray(machines) && machines.length > 0) {
      return machines.map((m, index) => {
        const status =
          m.status === 'Under Maintenance' ? "under-maintenance" : 
          m.status === 'Out of Service' ? 'out-of-service' :
          m.status.toLowerCase();
        return (
          <tr key={m.id}>
            <td>{m.name}</td>
            <td>{m.m_type}</td>
            <td>
              <span className={`status status-${status}`}>{m.status}</span>
            </td>
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
        getEntities={getMachines}
        search={search}
        setSearch={setSearch}
        filters={"machine"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        columns={["Código", "Nome", "Status", ""]}
      />
    </main>
  );
}
