import { useState, useCallback } from "react";
import { listOperations, deleteOperation, createOperation } from "../services/operationService";
import { cleanFormData } from "../utils/format";

export default function useOperations(pageSize) {
  const [operations, setOperations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOperations = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listOperations({
        page,
        pageSize,
        field,
        value,
      });

      setOperations(data);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  const removeOperation = async (operation) => {
    await deleteOperation(operation.id);
    setOperations((prev) => prev.filter((op) => op.id !== operation.id));
    setTotal((prev) => prev - 1);
  };

  const createNewOperation = async (data) => {
    const cleanedData = cleanFormData(data);
    await createOperation(cleanedData);
  };

  return {
    operations,
    total,
    loading,
    fetchOperations,
    removeOperation,
    createNewOperation,
  };
}
