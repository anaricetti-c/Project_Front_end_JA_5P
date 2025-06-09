// import qs from "qs";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";
import PaginatedTable from "../../components/PaginatedTable";
import DeleteModal from "../../components/DeleteModal";

export default function Material() {
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const navigate = useNavigate();

  function handleDeleteClick(material) {
    setMaterialToDelete(material);
  }

  useEffect(() => {
    const page = Number(search.get("page"));
    if (page) {
      fetchMaterials(page);
    }
  }, [search]);

  async function fetchMaterials(page) {
    setLoading(true);
    try {
      const field = search.get("field");
      const value = search.get("value");

      const requestParams = {
        // associations: ["customer", "created_by"],
        limit: pageSize,
        page: page,
      };

      if (field && value) {
        requestParams.field = `material.${field}`;
        requestParams.value = value;
      }

      const materialsResponse = await api.get(`/material/all`, {
        headers: getHeaders(),
        params: requestParams,
        // paramsSerializer: (params) =>
        //   qs.stringify(params, { arrayFormat: "repeat" }),
      });

      console.log(materialsResponse.data);
      setTotal(materialsResponse.data.metadata.total);
      setMaterials(materialsResponse.data.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeleteMaterial() {
      try {
        await api.delete(`/material/delete/${materialToDelete.id}`, {
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
  
        setMaterialToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar material:", error);
        toast.error("Erro ao deletar material.");
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
            <td>
              <img
                onClick={() => navigate(`/material/${m.id}`)}
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
          <td colSpan={8}>
            Nenhum material cadastrado.
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
        getEntities={getMaterials}
        search={search}
        setSearch={setSearch}
        pageSize={pageSize}
        setPageSize={setPageSize}
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
          "",
          "",
        ]}
      />
      <DeleteModal
        confirmDeleteMold={confirmDeleteMaterial}
        setMoldToDelete={setMaterialToDelete}
        moldToDelete={materialToDelete}
        model={"material"}
      />
    </main>
  );
}
