
import StyledLink from '../../Components/StyledLink';
import './style.css'

export default function AccessDenied() {
  return (
    <div className="access-container">
      <div className="access-card">
        <div className="access-header">Acesso negado</div>
        <div className="access-body">
            {/* <BsSignStopFill size={90} color="red" className="access-icon" /> */}
            <p className="access-message">
                Você não tem permissão para acessar essa página ou o token está expirado. Por favor faça o seu
                <StyledLink to="/" color='#dc3545' text={" login "}></StyledLink>.
            </p>
            
        </div>
      </div>
    </div>
  );
}