export default function MaterialRow({ material, onDetails, onDelete }) {
  const dateString = material.created_at;
  const date = new Date(dateString);
  const creation_date = date.toLocaleDateString("pt-BR");
  const description = material.description
    ? material.description
    : "Sem Descrição";
  const unit_of_measure = material.unit_of_measure
    ? material.unit_of_measure
    : "Não informado";
  return (
    <tr>
      <td>{material.name}</td>
      <td>{description}</td>
      <td>{material.lead_time}</td>
      <td>{creation_date}</td>
      <td>{material.stock_quantity}</td>
      <td>{unit_of_measure}</td>
      <td>
        <img
          onClick={onDetails}
          src="details.png"
          alt="Detalhes"
          className="icon"
        />
      </td>
      <td>
        <img
          onClick={onDelete}
          src="delete.png"
          alt="Deletar"
          className="icon"
        />
      </td>
    </tr>
  );
}
