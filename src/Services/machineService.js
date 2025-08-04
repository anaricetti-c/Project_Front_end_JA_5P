import { api } from "./api";
import { getHeaders } from "./headers";

export async function listMachines({ page, pageSize, field, value }) {
  const params = {
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `machine.${field}`;
    params.value = value;
  }

  const { data } = await api.get("/machine/all", {
    headers: getHeaders(),
    params,
  });

  return data;
}

export async function deleteMachine(id) {
  return api.delete(`/machine/delete/${id}`, { headers: getHeaders() });
}

export async function createMachine(data) {
  return api.post("/machine/register", data, {
    headers: getHeaders(),
  });
}
