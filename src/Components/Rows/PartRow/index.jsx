export default function PartRow({ part, onDetails, onDelete }) {
  const status =
    part.status === "In Progress" ? "progress" : part.status.toLowerCase();
  let material_associations = part.material_associations;
  let material = "Pending";

  if (material_associations.some((part) => part.status === "Pending")) {
    material = "Pending";
  } else if (
    material_associations.some((part) => part.status === "Available")
  ) {
    material = "Available";
  }
  const nc_status = part.nc_program !== null ? "available" : "pending";
  const model_3d_status = part.model_3d !== null ? "available" : "pending";

  return (
    <tr>
      <td>{part.mold.name}</td>
      <td>{part.name}</td>
      <td className="description-column">
        {part.description ? part.description : "Sem descrição"}
      </td>

      <td>
        <span className={`status status-${nc_status}`}>{nc_status}</span>
      </td>
      <td>
        <span className={`status status-${model_3d_status}`}>
          {model_3d_status}
        </span>
      </td>
      <td>
        <span className={`status status-${material.toLowerCase()}`}>
          {material}
        </span>
      </td>
      <td>
        <span className={`status status-${status}`}>{part.status}</span>
      </td>
      <td>{part.quantity}</td>
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
