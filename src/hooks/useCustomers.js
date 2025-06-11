import { useState, useCallback } from "react";
import { listCustomers } from "../services/customerService";

export default function useCustomers(pageSize) {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listCustomers({
        page,
        pageSize,
        field,
        value,
      });

      setCustomers(data);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  return { customers, fetchCustomers, total, loading };
}
