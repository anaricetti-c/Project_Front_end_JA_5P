import qs from "qs";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";
import DeleteModal from "../../components/DeleteModal";

export default function Machine() {
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const navigate = useNavigate();

  function handleDeleteClick(machine) {
    setMachineToDelete(machine);
  }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchMachines(page);
    }
  }, [search]);

  async function fetchMachines(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        // associations: ["customer", "created_by"],
        limit: pageSize,
        page: page,
      };

      if (field && value) {
        requestParams.field = `machine.${field}`;
        requestParams.value = value;
      }

      const machinesResponse = await api.get(`/machine/all`, {
        headers: getHeaders(),
        params: {
          // associations: ["machine"],
          page: page,
          limit: 10,
        },
        // paramsSerializer: (params) =>
        //   qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(machinesResponse.data);
      setTotal(machinesResponse.data.metadata.total);
      setMachines(machinesResponse.data.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteMachine() {
    try {
      await api.delete(`/machine/delete/${machineToDelete.id}`, {
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

      setMachineToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar maquina:", error);
      toast.error("Erro ao deletar maquina.");
    }
  }

  function getMachines() {
    if (Array.isArray(machines) && machines.length > 0) {
      return machines.map((m, index) => {
        const status =
          m.status === "Under Maintenance"
            ? "under-maintenance"
            : m.status === "Out of Service"
            ? "out-of-service"
            : m.status.toLowerCase();
        return (
          <tr key={m.id}>
            <td>{m.name}</td>
            <td>{m.m_type}</td>
            <td>
              <span className={`status status-${status}`}>{m.status}</span>
            </td>
            <td>
              <img
                onClick={() => navigate(`/machine/${m.id}`)}
                src="details.png"
                alt="Detalhes"
                className="icon"
              />
            </td>
            <td>
              <img
                onClick={() => handleDeleteClick(m)}
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
        columns={["Código", "Nome", "Status", "", ""]}
      />
      <DeleteModal
        confirmDeleteEntity={confirmDeleteMachine}
        setEntityToDelete={setMachineToDelete}
        entityToDelete={machineToDelete}
        entityName={"a máquina"}
      />
    </main>
  );
}
