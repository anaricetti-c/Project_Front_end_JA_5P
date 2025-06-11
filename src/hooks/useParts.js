import { useState, useCallback } from "react";
import { listParts, deletePart, createPart } from "../services/partService";

export default function useParts(pageSize) {
  const [parts, setParts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchParts = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listParts({
        page,
        pageSize,
        field,
        value,
      });

      setParts(data);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  const removePart = async (part) => {
    await deletePart(part.id);
    setParts((prev) => prev.filter((m) => m.id !== part.id));
    setTotal((prev) => prev - 1);
  };

  const createNewPart = async (data) => {
    // const normalizedData = {
    //   ...data,
    //   quantity: data.quantity ? Number(data.quantity) : undefined,
    // };
    await createPart(normalizedData);
  };

  return {
    parts,
    total,
    loading,
    fetchParts,
    removePart,
    createNewPart,
  };
}
