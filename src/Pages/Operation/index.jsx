import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./style.module.css";

import PaginatedTable from "../../components/PaginatedTable";
import OperationRow from "../../components/Rows/OperationRow";
import DeleteModal from "../../components/DeleteModal";
import OperationCreateModal from "../../components/CreateModal/OperationCreateModal";


import useOperations from "../../hooks/useOperations";

export default function Operation() {
  const [search, setSearch] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const navigate = useNavigate();

  const {
    operations,
    total,
    loading,
    fetchOperations,
    removeOperation,
    createNewOperation,
  } = useOperations(pageSize);

  useEffect(() => {
    const page = Number(search.get("page") || 1);
    const field = search.get("field") || null;
    const value = search.get("value") || null;
    fetchOperations({ page, field, value });
  }, [search, pageSize, fetchOperations]);

  const handleDelete = (op) => setDeleteTarget(op);

  const confirmDelete = async () => {
    await removeOperation(deleteTarget);
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
toast.success("Operação deletada com sucesso!");
  };

  const onCreate = async (formData) => {
    try {
      console.log(formData);
      await createNewOperation(formData);

      toast.success("Operação criada com sucesso!");
      setShowCreate(false);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
    } catch (error) {
      console.error("Erro ao criar operação:", error);
      toast.error("Erro ao criar operação.");
    }
  };

  function getOperationRows() {
    if (Array.isArray(operations) && operations.length > 0) {
      return operations.map((op) => (
        <OperationRow
          key={op.id}
          operation={op}
          onDetails={() => navigate(`/operation/${op.id}`)}
          onDelete={() => handleDelete(op)}
        />
      ));
    } else {
      return (
        <tr>
          <td className="emptyRow" colSpan={9}>Nenhuma operação cadastrada.</td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        tableName="Operações"
        total={total}
        loading={loading}
        getEntities={() => getOperationRows()}
        search={search}
        setSearch={setSearch}
        setShowModal={() => setShowCreate(true)}
        filters={"operation"}
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={["Código", "Nome", "Máquina", "Data de Criação", "", ""]}
      />
      <DeleteModal
        entityName={"a operação"}
        entityToDelete={deleteTarget}
        setEntityToDelete={setDeleteTarget}
        confirmDeleteEntity={confirmDelete}
      />
      <OperationCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={onCreate}
      />
    </main>
  );
}
