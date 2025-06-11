
export default function MoldRow({ mold, onDetails, onDelete }) {
  const date = new Date(mold.delivery_date).toLocaleDateString("pt-BR");
  const status = mold.status === "In Progress" ? "progress" : mold.status.toLowerCase();
  const customer = mold.customer
    ? `${mold.customer.full_name} ${mold.customer.country_name}`
    : "Cliente não informado";

  return (
    <tr>
      <td>{mold.name}</td>
      <td>{customer}</td>
      <td>
        <span className={`priority priority-${mold.priority.toLowerCase()}`}>
          {mold.priority}
        </span>
      </td>
      <td>{date}</td>
      <td>
        <span className={`status status-${status}`}>{mold.status}</span>
      </td>
      <td>{mold.progress_percentage}%</td>
      <td>{mold.quantity}</td>
      <td><img onClick={onDetails} src="details.png" alt="Detalhes" className="icon" /></td>
      <td><img onClick={onDelete}   src="delete.png"  alt="Deletar"  className="icon" /></td>
    </tr>
  );
}
