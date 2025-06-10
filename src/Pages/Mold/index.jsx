import qs from "qs";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";
import GenericCreateModal from "../../components/GenericCreateModal";
import DeleteModal from "../../components/DeleteModal";

export default function Mold() {
  const [loading, setLoading] = useState(false);
  const [molds, setMolds] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [moldToDelete, setMoldToDelete] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [modalFields, setModalFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/customer/all", {
        headers: getHeaders(),
        params: { limit: 999, page: 1 },
      });
      console.log(data.data);
      setCustomers(data.data);
    })();
  }, []);

  useEffect(() => {
    if (customers.length) {
      setModalFields(getMoldFields(customers));
    }
  }, [customers]);

  function getMoldFields(customers) {
    return [
      {
        name: "delivery_date",
        label: "Data de Entrega",
        type: "date",
        required: true,
      },
      {
        name: "quantity",
        label: "Quantidade",
        type: "number",
        required: false,
      },
      {
        name: "dimensions",
        label: "Dimensões",
        type: "text",
        required: false,
        placeholder: "Ex: 30x40x50",
      },
      {
        name: "customer_id",
        label: "Cliente",
        type: "select",
        options: customers.map((c) => ({
          label: `${c.full_name} (${c.country_code})`,
          value: c.id,
        })),
        required: true,
      },
    ];
  }

  const handleCreateMold = async (data) => {
    try {
      const normalizedData = {
        ...data,
        quantity: data.quantity ? Number(data.quantity) : undefined,
      };

      await api.post("/mold/register", normalizedData, {
        headers: getHeaders(),
      });

      toast.success("Molde criado com sucesso!");
      setShowModal(false);

      setSearch((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", 1);
        newParams.set("refresh", Date.now().toString());
        return newParams;
      });
    } catch (error) {
      console.error("Erro ao criar molde:", error);
      toast.error("Erro ao criar molde.");
    }
  };

  function handleDeleteClick(mold) {
    setMoldToDelete(mold);
  }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchMolds(page);
    }
  }, [search]);

  async function fetchMolds(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        associations: ["customer", "created_by"],
        limit: pageSize,
        page: page,
      };

      if (field && value) {
        requestParams.field = field.includes(".") ? field : `mold.${field}`;
        requestParams.value = value;
      }
      console.log(requestParams);

      const moldsResponse = await api.get(`/mold/all`, {
        headers: getHeaders(),
        params: requestParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      const priorityOrder = {
        Urgent: 1,
        High: 2,
        Medium: 3,
        Low: 4,
      };

      const sortedMolds = [...moldsResponse.data.data].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      console.log(moldsResponse.data);
      setTotal(moldsResponse.data.metadata.total);
      setMolds(sortedMolds);
    } catch (error) {
      console.error("Error fetching molds:", error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteMold() {
    try {
      await api.delete(`/mold/delete/${moldToDelete.id}`, {
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

      setMoldToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar molde:", error);
      toast.error("Erro ao deletar molde.");
    }
  }

  function getMolds() {
    if (Array.isArray(molds) && molds.length > 0) {
      return molds.map((m) => {
        const dateString = m.delivery_date;
        const date = new Date(dateString);
        const delivery_date_formatted = date.toLocaleDateString("pt-BR");
        const status =
          m.status === "In Progress" ? "progress" : m.status.toLowerCase();
        const customer_info = m.customer
          ? `${m.customer.full_name} ${m.customer.country_name}`
          : "Customere não informado";
        return (
          <tr key={m.id}>
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
            <td>
              <img
                onClick={() => navigate(`/mold/${m.id}`)}
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
          <td colSpan={9}>Nenhum molde cadastrado.</td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        tableName="Moldes"
        total={total}
        loading={loading}
        getEntities={getMolds}
        search={search}
        setSearch={setSearch}
        setShowModal={setShowModal}
        filters={"mold"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setPageSize={setPageSize}
        pageSize={pageSize}
        columns={[
          "Código",
          "Customere",
          "Prioridade",
          "Prazo",
          "Status",
          "Progresso",
          "Quantidade",
          "",
          "",
        ]}
      />
      <DeleteModal
        confirmDeleteEntity={confirmDeleteMold}
        setEntityToDelete={setMoldToDelete}
        entityToDelete={moldToDelete}
        entityName={"o molde"}
      />

      <GenericCreateModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateMold}
        title="Criar Molde"
        fields={modalFields}
      />
    </main>
  );
}
