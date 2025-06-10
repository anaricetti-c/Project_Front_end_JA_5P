import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CustomSelect from "../CustomSelect";
import CustomPagination from "../CustomPagination";

import styles from "./style.module.css"; // certifique-se de ter um CSS adequado para cards

export default function PaginatedCards({
  title = "",
  loading,
  getCards,
  selectedFilter,
  setSelectedFilter,
  search,
  setSearch,
  total,
  filters,
  pageSize = 6,
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
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.searchBar}>
          <button className={`${styles.button} ${styles.adicionar}`}>
            Adicionar
          </button>
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

      <div className={styles.cardGrid}>
        {!loading && getCards()}
      </div>

      {!loading && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}></div>
          <CustomPagination
            pageSize={pageSize}
            search={search}
            setSearch={setSearch}
            total={total}
          />
          <div className={styles.paginationInfo}>
            <span className={styles.totalLabel}>
              Total: <strong>{total}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
