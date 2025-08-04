import styles from "./style.module.css";

export default function DeleteModal({
  confirmDeleteEntity,
  setEntityToDelete,
  entityToDelete,
  entityName,
  att = 'name'
}) {
  if (!entityToDelete) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Confirmar exclusão</h3>
        <p>
          Tem certeza que deseja excluir {entityName}{" "}
          <strong>{entityToDelete[att]}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button
            onClick={() => confirmDeleteEntity()}
            className={styles.confirmButton}
          >
            Confirmar
          </button>
          <button
            onClick={() => setEntityToDelete(null)}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
