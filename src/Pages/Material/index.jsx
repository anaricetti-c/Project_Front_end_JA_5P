import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./style.module.css";

import PaginatedTable from "../../components/PaginatedTable";
import MaterialRow from "../../components/Rows/MaterialRow";
import DeleteModal from "../../components/DeleteModal";
import MaterialCreateModal from "../../components/CreateModal/MaterialCreateModal";

import useMaterials from "../../hooks/useMaterials";

export default function Material() {
  const [search, setSearch] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const navigate = useNavigate();

  const {
    materials,
    total,
    loading,
    fetchMaterials,
    removeMaterial,
    createNewMaterial,
  } = useMaterials(pageSize);

  useEffect(() => {
    const page = Number(search.get("page") || 1);
    const field = search.get("field") || null;
    const value = search.get("value") || null;
    fetchMaterials({ page, field, value });
  }, [search, pageSize, fetchMaterials]);

  const handleDelete = (m) => setDeleteTarget(m);

  const confirmDelete = async () => {
    await removeMaterial(deleteTarget);
    const currentPage = Number(search.get("page")) || 1;
    const newTotal = total - 1;

    const maxPage = Math.ceil(newTotal / pageSize);
    const newPage = currentPage > maxPage ? maxPage : currentPage;
    console.log("AAAA")
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
      // await createNewMaterial(formData);

      toast.success("Material criada com sucesso!");
      setShowCreate(false);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
    } catch (error) {
      console.error("Erro ao criar material:", error);
      toast.error("Erro ao criar material.");
    }
  };

  function getMaterialRows() {
    if (Array.isArray(materials) && materials.length > 0) {
      return materials.map((m) => (
        <MaterialRow
          key={m.id}
          material={m}
          onDetails={() => navigate(`/material/${m.id}`)}
          onDelete={() => handleDelete(m)}
        />
      ));
    } else {
      return (
        <tr>
          <td colSpan={9}>Nenhum material cadastrada.</td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        tableName="Materiais"
        total={total}
        loading={loading}
        getEntities={() => getMaterialRows()}
        search={search}
        setSearch={setSearch}
        setShowModal={() => setShowCreate(true)}
        filters={"material"}
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={[
          "Código",
          "Descrição",
          "Tempo de Entrega",
          "Data de Criação",
          "Quantidade em Estoque",
          "Unidade de Medida",
          "",
          "",
        ]}
      />
      <DeleteModal
        entityName={"o material"}
        entityToDelete={deleteTarget}
        setEntityToDelete={setDeleteTarget}
        confirmDeleteEntity={confirmDelete}
      />
      <MaterialCreateModal
      open={showCreate}
      onClose={() => setShowCreate(false)}
      onSubmit={onCreate}
      />
    </main>
  );
}
