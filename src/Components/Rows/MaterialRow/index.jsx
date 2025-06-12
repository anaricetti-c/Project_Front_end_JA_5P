export default function MaterialRow({ material, onDetails, onDelete }) {
  const dateString = material.created_at;
  const date = new Date(dateString);
  const creation_date = date.toLocaleDateString("pt-BR");
  return (
    <tr>
      <td>{material.name}</td>
      <td>{material.description}</td>
      <td>{material.lead_time}</td>
      <td>{creation_date}</td>
      <td>{material.stock_quantity}</td>
      <td>{material.unit_of_measure}</td>
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
