import qs from "qs";
import { api } from "./api";
import { getHeaders } from "./headers";

export async function listParts({ page, pageSize, field, value }) {
  const params = {
    associations: [
      "mold",
      "operation_associations",
      "material_associations",
      "nc_program",
      "model_3d",
    ],
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `part.${field}`;
    params.value = value;
  }

  const { data } = await api.get("/part/all", {
    headers: getHeaders(),
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  return data;
}

export async function deletePart(id) {
  return api.delete(`/part/delete/${id}`, { headers: getHeaders() });
}

export async function createPart(data) {
  return api.post("/part/register", data, {
    headers: getHeaders(),
  });
}
