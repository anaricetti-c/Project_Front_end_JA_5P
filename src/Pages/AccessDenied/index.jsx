import { Link } from 'react-router-dom';
import styles from "./style.module.css";
import { BsShieldLockFill } from "react-icons/bs"; // ou qualquer outro ícone

export default function AccessDenied() {
  return (
    <div className={styles.accessContainer}>
      <div className={styles.accessCard}>
        <div className={styles.accessHeader}>Acesso Negado</div>
        <div className={styles.accessBody}>
          <BsShieldLockFill className={styles.accessIcon} />
          <p className={styles.accessMessage}>
            Você não tem permissão para acessar esta página ou sua sessão expirou.
          </p>
          <Link to="/" className={styles.loginButton}>Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}
