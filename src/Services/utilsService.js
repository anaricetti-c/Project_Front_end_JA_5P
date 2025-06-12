import { api } from "./api";
import { getHeaders } from "./headers";

export async function listCountry() {
  const { data } = await api.get("/utils/country", {
    headers: getHeaders(),
  });
  return data;
}

export async function listTimeUnit() {
  const { data } = await api.get("/utils/time_unit", {
    headers: getHeaders(),
  });
  return data;
}

export async function listFilterFields(model) {
  const { data } = await api.get(`/utils/filter_fields?model=${model}`, {
    headers: getHeaders(),
  });

  return data;
}
