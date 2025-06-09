import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CustomSelect from "../CustomSelect";
import CustomPagination from "../CustomPagination";

import styles from "./style.module.css";

export default function PaginatedTable({
  loading,
  getEntities,
  selectedFilter,
  setSelectedFilter,
  search,
  setSearch,
  total,
  filters,
  columns = [],
  pageSize = 15,
  setPageSize,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!search.get("page")) {
      setSearch({ page: "1" });
    }
  }, [search, setSearch]);

  const handleSearch = () => {
    if (!selectedFilter) {
      toast.error("Por favor, selecione um filtro antes de pesquisar.");
      return;
    }

    setSearch((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", "1");
      newParams.set("field", selectedFilter);
      newParams.set("value", searchTerm.trim());
      return newParams;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.adicionar}`}>
          Adicionar
        </button>
        {/* <button className={`${styles.button} ${styles.importar}`}>
          Importar
        </button> */}
        {/* <button className={`${styles.button} ${styles.relatorios}`}>
            Relatórios
          </button> */}

        <div className={styles.searchBar}>
          <CustomSelect
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            model={filters}
          />

          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.searchIcon}
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>{!loading && getEntities()}</tbody>
        </table>
      </div>
      {!loading && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
      
          </div>
          <CustomPagination
            pageSize={pageSize}
            search={search}
            setSearch={setSearch}
            total={total}
          />
          <div className={styles.paginationInfo}>
            <label>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  setPageSize(newSize);
                  
                  setSearch((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set("page", "1");
                    newParams.set("refresh", Date.now().toString());
                    return newParams;
                  });
                }}
              >
                {[10, 15, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <span className={styles.totalLabel}>
              Total: <strong>{total}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
