import qs from "qs";
import { api } from "./api";
import { getHeaders } from "./headers";

export async function listMolds({ page, pageSize, field, value }) {
  const params = {
    associations: ["customer", "created_by"],
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `mold.${field}`;
    params.value = value;
  }

  const { data } = await api.get("/mold/all", {
    headers: getHeaders(),
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  return data;
}

export async function deleteMold(id) {
  return api.delete(`/mold/delete/${id}`, { headers: getHeaders() });
}

export async function createMold(data) {
  return api.post("/mold/register", data, {
    headers: getHeaders(),
  });
}
