import { Link } from "react-router-dom";
import styles from "./styles.module.css";


export default function NotFoundPage() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundCard}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.message}>Página não encontrada.</p>
        <p className={styles.subMessage}>
          A página que você está procurando pode ter sido removida ou não existe.
        </p>
        <Link to="/" className={styles.homeButton}>
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}