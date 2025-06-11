import { api } from "./api";
import { getHeaders } from "./headers";

export async function listCustomers({ page, pageSize, field, value }) {
  const params = {
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `mold.${field}`;
    params.value = value;
  }
  
  
  const { data } = await api.get("/customer/all", {
    headers: getHeaders(),
    params
  });
  return data;
}
