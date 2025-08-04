import styles from "./style.module.css";

export default function CustomerCard({ customer, onSearch, onDelete }) {
  return (
    <div key={customer.id} className={styles.card}>
      <div className={styles.titleRow}>
        <h2>{customer.full_name}</h2>
        <div className={styles.cardActions}>
          <img
            onClick={onSearch}
            src="lupa.png"
            alt="Pesquisar"
            className={styles.icon}
          />
          <img
            onClick={onDelete}
            src="delete.png"
            alt="Deletar"
            className={styles.icon}
          />
        </div>
      </div>

      <p>
        <strong>País:</strong> {customer.country_name} {" - "}{" "}
        {customer.country_code}
      </p>

      <p className={styles.createdAt}>
        <small>
          Criado em: {new Date(customer.created_at).toLocaleDateString()}
        </small>
      </p>
    </div>
  );
}
