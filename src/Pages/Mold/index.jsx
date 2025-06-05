import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../Services/api";
import { getHeaders } from "../../Services/headers";
import PaginatedTable from "../../Components/PaginatedTable";

export default function Mold() {
  const [loading, setLoading] = useState(false);
  const [molds, setMolds] = useState([]);
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
      fetchMolds(page);
    }
  }, [search]);

  async function fetchMolds(page) {
    setLoading(true);
    try {
      const moldsResponse = await api.get(`/mold/all`, {
        headers: getHeaders(),
        params: {
          associations: ["customer", "created_by"],
          page: page,
          limit: 15,
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
      setTotal(moldsResponse.data.metadata.total);

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
        const customer_info = m.customer
          ? `${m.customer.full_name} ${m.customer.country_name}`
          : "Cliente não informado";
        return (
          <tr key={index}>
            <td>{m.name}</td>
            <td>{customer_info}</td>
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
    <main className={styles.main}>
      <PaginatedTable
        total={total}
        loading={loading}
        getEntities={getMolds}
        search={search}
        setSearch={setSearch}
        filters={"mold"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        columns={[
          "Código",
          "Cliente",
          "Prioridade",
          "Prazo",
          "Status",
          "Progresso",
          "Quantidade",
        ]}
      />
    </main>
  );
}
