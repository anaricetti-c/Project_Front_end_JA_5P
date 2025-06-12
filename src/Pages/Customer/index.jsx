import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import CustomPagination from "../../components/CustomPagination";
import CustomSelect from "../../components/CustomSelect";
import PaginatedCards from "../../components/PaginatedCards";

export default function Customer() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();

  // const [customerToDelete, setCustomerToDelete] = useState(null);

  // function handleDeleteClick(mold) {
  //   setCustomerToDelete(mold);
  // }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchCustomers(page);
    }
  }, [search]);

  async function fetchCustomers(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        // associations: [],
        limit: 9,
        page: page,
      };

      if (field && value) {
        requestParams.field = `customer.${field}`;
        requestParams.value = value;
      }

      const customersResponse = await api.get(`/customer/all`, {
        headers: getHeaders(),
        params: requestParams,
        // paramsSerializer: (params) =>
        //   qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(customersResponse.data);
      setTotal(customersResponse.data.metadata.total);
      setCustomers(customersResponse.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }

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

  function getCustomers() {
    if (Array.isArray(customers) && customers.length > 0) {
      return customers.map((c) => {
        return (
          <div key={c.id} className={styles.card}>
            <div className={styles.titleRow}>
              <h2>{c.full_name}</h2>
              <div className={styles.cardActions}>
                <img
                  onClick={() => handleSearch(c)}
                  src="lupa.png"
                  alt="Pesquisar"
                  className={styles.icon}
                />
                <img
                  onClick={() => handleDeleteClick(c)}
                  src="delete.png"
                  alt="Deletar"
                  className={styles.icon}
                />
              </div>
            </div>

            <p>
              <strong>País:</strong> {c.country_name} {" - "} {c.country_code}
            </p>

            <p className={styles.createdAt}>
              <small>
                Criado em: {new Date(c.created_at).toLocaleDateString()}
              </small>
            </p>
          </div>
        );
      });
    } else {
      return <div className={styles.empty}>Nenhum cliente cadastrado.</div>;
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedCards
        title="Clientes"
        filters={"customer"}
        getCards={getCustomers}
        loading={loading}
        search={search}
        rows={3}
        selectedFilter={selectedFilter}
        setSearch={setSearch}
        setSelectedFilter={setSelectedFilter}
        total={total}
      />
    </main>
  );
}
