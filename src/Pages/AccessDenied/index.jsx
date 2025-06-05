import StyledLink from "../../Components/StyledLink";
import styles from "./style.module.css";

export default function AccessDenied() {
  return (
    <div className={styles.accessContainer}>
      <div className={styles.accessCard}>
        <div className={styles.accessHeader}>Acesso negado</div>
        <div className={styles.accessBody}>
          {/* <BsSignStopFill size={90} color="red" className="access-icon" /> */}
          <p className={styles.accessMessage}>
            Você não tem permissão para acessar essa página ou o token está
            expirado. Por favor faça o seu
            <StyledLink to="/" color="#dc3545" text={" login "}></StyledLink>.
          </p>
        </div>
      </div>
    </div>
  );
}
