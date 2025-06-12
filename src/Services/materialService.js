import { api } from "./api";
import { getHeaders } from "./headers";

export async function listMaterials({ page, pageSize, field, value }) {
  const params = {
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `material.${field}`;
    params.value = value;
  }

  const { data } = await api.get("/material/all", {
    headers: getHeaders(),
    params,
  });

  return data;
}

export async function deleteMaterial(id) {
  return api.delete(`/material/delete/${id}`, { headers: getHeaders() });
}

export async function createMaterial(data) {
  return api.post("/material/register", data, {
    headers: getHeaders(),
  });
}
