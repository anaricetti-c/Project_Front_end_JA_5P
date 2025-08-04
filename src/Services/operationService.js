import qs from "qs";
import { api } from "./api";
import { getHeaders } from "./headers";

export async function listOperations({ page, pageSize, field, value }) {
  const params = {
    associations: ["machine"],
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `operation.${field}`;
    params.value = value;
  }

  const { data } = await api.get("/operation/all", {
    headers: getHeaders(),
    params,
    paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
  });

  return data;
}

export async function deleteOperation(id) {
  return api.delete(`/operation/delete/${id}`, { headers: getHeaders() });
}

export async function createOperation(data) {
  return api.post("/operation/register", data, {
    headers: getHeaders(),
  });
}
