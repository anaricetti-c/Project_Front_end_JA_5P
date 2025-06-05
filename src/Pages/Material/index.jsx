// import qs from "qs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";

export default function Material() {
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
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
      fetchMaterials(page);
    }
  }, [search]);

  async function fetchMaterials(page) {
    setLoading(true);
    try {
      const materialsResponse = await api.get(`/material/all`, {
        headers: getHeaders(),
        params: {
          // associations: ["customer", "created_by"],
          page: page,
          limit: 9,
        },
        // paramsSerializer: (params) =>
        //   qs.stringify(params, { arrayFormat: "repeat" }),
      });
      setTotal(materialsResponse.data.metadata.total);
      console.log(materialsResponse.data);
      setMaterials(materialsResponse.data.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  }

  function getMaterials() {
    if (Array.isArray(materials) && materials.length > 0) {
      return materials.map((m, index) => {
        const dateString = m.created_at;
        const date = new Date(dateString);
        const creation_date = date.toLocaleDateString("pt-BR");
        return (
          <tr key={index}>
            <td>{m.name}</td>
            <td>{m.description}</td>
            <td>{m.lead_time}</td>
            <td>{creation_date}</td>
            <td>{m.stock_quantity}</td>
            <td>{m.unit_of_measure}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={7} className="text-center py-4">
            Nenhuma operação cadastrada.
          </td>
        </tr>
      );
    }
  }

  return (
    <main className={styles.main}>
      <PaginatedTable
        total={total}
        pageSize={9}
        loading={loading}
        getEntities={getMaterials}
        search={search}
        setSearch={setSearch}
        filters={"material"}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        columns={[
          "Código",
          "Descrição",
          "Tempo de Entrega",
          "Data de Criação",
          "Quantidade em Estoque",
          "Unidade de Medida",
        ]}
      />
    </main>
  );
}
