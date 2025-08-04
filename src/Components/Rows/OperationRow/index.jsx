export default function OperationRow({ operation, onDetails, onDelete }) {
  console.log(operation)
  const dateString = operation.created_at;
  const date = new Date(dateString);
  const creation_date = date.toLocaleDateString("pt-BR");
  const machine = operation.machine !== null ? operation.machine.m_type : "Operação Manual";
  return (
    <tr>
      <td>{operation.name}</td>
      <td>{operation.op_type}</td>
      <td>{machine}</td>
      <td>{creation_date}</td>
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
