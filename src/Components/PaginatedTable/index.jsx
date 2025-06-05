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
  filters = [],
  columns = [],
}) {
  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.adicionar}`}>
          Adicionar
        </button>
        {/* <button className={`${styles.button} ${styles.importar}`}>
            Importar
          </button>
          <button className={`${styles.button} ${styles.relatorios}`}>
            Relatórios
          </button> */}

        <div className={styles.searchBar}>
          <CustomSelect
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            filters={filters}
          />

          <input type="text" placeholder="" />
          <button className={styles.searchButton}>
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
      {!loading && <CustomPagination search={search} setSearch={setSearch} total={total}/>}
    </div>
  );
}
