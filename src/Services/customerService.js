import { api } from "./api";
import { getHeaders } from "./headers";

export async function listCustomers({ page, pageSize, field, value }) {
  const params = {
    limit: pageSize,
    page,
  };

  if (field && value) {
    params.field = field.includes(".") ? field : `customer.${field}`;
    params.value = value;
  }
  
  
  const { data } = await api.get("/customer/all", {
    headers: getHeaders(),
    params
  });
  return data;
}

export async function deleteCustomer(id) {
  return api.delete(`/customer/delete/${id}`, { headers: getHeaders() });
}

export async function createCustomer(data) {
  return api.post("/customer/register", data, {
    headers: getHeaders(),
  });
}
