import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./style.module.css";

import PaginatedTable from "../../components/PaginatedTable";
import PartRow from "../../components/Rows/PartRow";
import DeleteModal from "../../components/DeleteModal";

import useParts from "../../hooks/useParts";
import PartCreateModal from "../../components/CreateModal/PartCreateModal";

export default function Part() {
  const [search, setSearch] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const { parts, total, loading, fetchParts, removePart, createNewPart } =
    useParts(pageSize);

  useEffect(() => {
    const page = Number(search.get("page") || 1);
    const field = search.get("field") || null;
    const value = search.get("value") || null;
    fetchParts({ page, field, value });
  }, [search, pageSize, fetchParts]);

  useEffect(() => {
    setFields([
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
    ]);
  }, []);

  const handleDelete = (p) => setDeleteTarget(p);

  const confirmDelete = async () => {
    await removePart(deleteTarget);
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
    setDeleteTarget(null);
  };

  const onCreate = async (formData) => {
    try {
      // await createNewPart(formData);
      // console.log(formData);
      toast.success("Peça criada com sucesso!");
      setShowCreate(false);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
    } catch (error) {
      console.error("Erro ao criar peça:", error);
      toast.error("Erro ao criar peça.");
    }
  };

  function getPartRows() {
    if (Array.isArray(parts) && parts.length > 0) {
      return parts.map((p) => (
        <PartRow
          key={p.id}
          part={p}
          onDetails={() => navigate(`/part/${p.id}`)}
          onDelete={() => handleDelete(p)}
        />
      ));
    } else {
      return (
        <tr>
          <td colSpan={9}>Nenhuma peça cadastrada.</td>
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
        getEntities={() => getPartRows()}
        search={search}
        setSearch={setSearch}
        setShowModal={() => setShowCreate(true)}
        filters={"part"}
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={[
          "Molde",
          "Nome",
          "Descrição",
          "Programa NC",
          "Modelo 3D",
          "Materiais",
          "Status",
          "Quantidade",
          "",
          "",
        ]}
      />
      <DeleteModal
        entityName={"a peça"}
        entityToDelete={deleteTarget}
        setEntityToDelete={setDeleteTarget}
        confirmDeleteEntity={confirmDelete}
      />
      <PartCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={onCreate}
      />
    </main>
  );
}
