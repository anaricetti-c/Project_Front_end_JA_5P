import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./style.module.css";

import PaginatedTable from "../../components/PaginatedTable";
import MoldRow from "../../components/Rows/MoldRow";
import DeleteModal from "../../components/DeleteModal";
import GenericCreateModal from "../../components/GenericCreateModal";

import useMolds from "../../hooks/useMolds";
import useCustomers from "../../hooks/useCustomers";

export default function Mold() {
  const [search, setSearch] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const [fields, setFields] = useState([
    {
      name: "delivery_date",
      label: "Data de Entrega",
      type: "date",
      required: true,
      size: 12,
    },
    {
      name: "quantity",
      label: "Quantidade",
      type: "number",
      required: false,
      size: 12,
    },
    {
      name: "dimensions",
      label: "Dimensões",
      type: "text",
      required: false,
      placeholder: "Ex: 30x40x50",
      size: 12,
    },
    {
      name: "customer_id",
      label: "Cliente",
      type: "select",
      selectMode: "smart",
      required: false,
      options: [],
      placeholder: "Nenhum cliente cadastrado no momento..."
    },
  ]);
  const navigate = useNavigate();

  const { molds, total, loading, fetchMolds, removeMold, createNewMold } =
    useMolds(pageSize);
  const { customers, fetchCustomers } = useCustomers(999);

  useEffect(() => {
    const page = Number(search.get("page") || 1);
    const field = search.get("field") || null;
    const value = search.get("value") || null;
    fetchMolds({ page, field, value });
    fetchCustomers({ page });
  }, [search, pageSize, fetchMolds]);

  useEffect(() => {
    if (customers.length) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "customer_id"
            ? {
                ...field,
                placeholder: null,
                options: customers.map((c) => ({
                  label: `${c.full_name} (${c.country_code})`,
                  value: c.id,
                })),
              }
            : field
        )
      );
    }
  }, [customers]);

  const handleDelete = (m) => setDeleteTarget(m);

  const confirmDelete = async () => {
    await removeMold(deleteTarget);
    const currentPage = Number(search.get("page")) || 1;
    const newTotal = total - 1;

    const maxPage = Math.ceil(newTotal / pageSize);
    const newPage = currentPage > maxPage ? maxPage : currentPage;

    setSearch((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage ? newPage : 1);
      newParams.set("refresh", Date.now().toString());
      return newParams;
    });
    setDeleteTarget(null);
    toast.success("Molde deletado com sucesso!");
  };

  const onCreate = async (formData) => {
    try {
      await createNewMold(formData);
      toast.success("Molde criado com sucesso!");
      setShowCreate(false);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
    } catch (error) {
      console.error("Erro ao criar molde:", error);
      // toast.error("Erro ao criar molde.");
      toast.error(error.response.data.detail);

    }
  };

  function getMoldRows() {
    if (Array.isArray(molds) && molds.length > 0) {
      return molds.map((m) => (
        <MoldRow
          key={m.id}
          mold={m}
          onDetails={() => navigate(`/mold/${m.id}`)}
          onDelete={() => handleDelete(m)}
        />
      ));
    } else {
      return (
        <tr>
          <td className="emptyRow" colSpan={9}>Nenhum molde cadastrado.</td>
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
        getEntities={() => getMoldRows()}
        search={search}
        setSearch={setSearch}
        setShowModal={() => setShowCreate(true)}
        filters="mold"
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={[
          "Código",
          "Cliente",
          "Prioridade",
          "Prazo",
          "Status",
          "Progresso",
          "Qtd",
          "",
          "",
        ]}
      />

      <DeleteModal
        entityName="o molde"
        entityToDelete={deleteTarget}
        setEntityToDelete={setDeleteTarget}
        confirmDeleteEntity={confirmDelete}
      />

      <GenericCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={onCreate}
        title="Criar Molde"
        fields={fields}
      />
    </main>
  );
}
