import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import CustomPagination from "../../components/CustomPagination";
import CustomSelect from "../../components/CustomSelect";
import PaginatedCards from "../../components/PaginatedCards";

export default function User() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");

  // const [userToDelete, setUserToDelete] = useState(null);
  // const navigate = useNavigate();

  // function handleDeleteClick(mold) {
  //   setUserToDelete(mold);
  // }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchUsers(page);
    }
  }, [search]);

  async function fetchUsers(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        // associations: [],
        limit: 6,
        page: page,
      };

      if (field && value) {
        requestParams.field = `user.${field}`;
        requestParams.value = value;
      }

      const usersResponse = await api.get(`/user/all`, {
        headers: getHeaders(),
        params: requestParams,
        // paramsSerializer: (params) =>
        //   qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(usersResponse.data);
      setTotal(usersResponse.data.metadata.total);
      setUsers(usersResponse.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  function getUsers() {
    if (Array.isArray(users) && users.length > 0) {
      return users.map((u) => {
        return (
          <div key={u.id} className={styles.card}>
            <h2>{u.full_name}</h2>
            <p>
              <strong>Email:</strong> {u.email}
            </p>
            <p>
              <strong>Matrícula:</strong> {u.registration_number}
            </p>
            <p>
              <strong>Cargo:</strong> {u.role}
            </p>
            <p className={styles.createdAt}>
              <small>
                Criado em: {new Date(u.created_at).toLocaleDateString()}
              </small>
            </p>
          </div>
        );
      });
    } else {
      return <p>Nenhum usuário cadastrado.</p>;
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedCards
        title="Usuários"
        filters={"user"}
        getCards={getUsers}
        loading={loading}
        search={search}
        selectedFilter={selectedFilter}
        setSearch={setSearch}
        setSelectedFilter={setSelectedFilter}
        total={total}
      />
    </main>
  );
}
