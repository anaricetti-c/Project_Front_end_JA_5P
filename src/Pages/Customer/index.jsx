import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./style.module.css";

import PaginatedCards from "../../components/PaginatedCards";
import DeleteModal from "../../components/DeleteModal";
import useCustomers from "../../hooks/useCustomers";
import CustomerCard from "../../components/Card/CustomerCard";
import CustomerCreateModal from "../../components/CreateModal/CustomerCreateModal";

export default function Customer() {
  const [search, setSearch] = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const {
    customers,
    total,
    loading,
    fetchCustomers,
    removeCustomer,
    createNewCustomer,
  } = useCustomers(9);

  useEffect(() => {
    const page = Number(search.get("page") || 1);
    const field = search.get("field") || null;
    const value = search.get("value") || null;
    fetchCustomers({ page, field, value });
  }, [search, fetchCustomers]);

  const handleDelete = (c) => setDeleteTarget(c);

  const handleSearch = (customer) => {
    const params = new URLSearchParams({
      page: 1,
      limit: 15,
      associations: ["customer", "created_by"],
      field: "customer.full_name",
      value: customer.full_name.trim(),
    });

    navigate(`/molds?${params.toString()}`);
  };

  const confirmDelete = async () => {
    await removeCustomer(deleteTarget);
    const currentPage = Number(search.get("page")) || 1;
    const newTotal = total - 1;

    const maxPage = Math.ceil(newTotal / 9);
    const newPage = currentPage > maxPage ? maxPage : currentPage;

    setSearch((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage ? newPage : 1);
      newParams.set("refresh", Date.now().toString());
      return newParams;
    });
    setDeleteTarget(null);
    toast.success("Cliente deletado com sucesso!");
  };

  const onCreate = async (formData) => {
    try {
      await createNewCustomer(formData);

      toast.success("Cliente criada com sucesso!");
      setShowCreate(false);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente.");
    }
  };

  function getCustomerCards() {
    if (Array.isArray(customers) && customers.length > 0) {
      return customers.map((c) => {
        return (
          <CustomerCard
            key={c.id}
            customer={c}
            onSearch={() => handleSearch(c)}
            onDelete={() => handleDelete(c)}
          />
        );
      });
    } else {
      return <div className={styles.cardEmpty}>Nenhum cliente cadastrado.</div>;
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedCards
        title="Clientes"
        total={total}
        loading={loading}
        getCards={() => getCustomerCards()}
        search={search}
        setSearch={setSearch}
        setShowModal={() => setShowCreate(true)}
        filters={"customer"}
        pageSize={9}
        rows={3}
      />
      <DeleteModal
        entityName={"o cliente"}
        entityToDelete={deleteTarget}
        setEntityToDelete={setDeleteTarget}
        confirmDeleteEntity={confirmDelete}
        att="full_name"
      />
      <CustomerCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={onCreate}
      />
    </main>
  );
}
