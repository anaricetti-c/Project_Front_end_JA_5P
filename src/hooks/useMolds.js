import { useState, useCallback } from "react";
import { listMolds, deleteMold, createMold } from "../services/moldService";

export default function useMolds(pageSize) {
  const [molds, setMolds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMolds = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listMolds({
        page,
        pageSize,
        field,
        value,
      });

      const priorityOrder = { Urgent: 1, High: 2, Medium: 3, Low: 4 };
      const sorted = [...data].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );

      setMolds(sorted);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  const removeMold = async (mold) => {
    await deleteMold(mold.id);
    setMolds((prev) => prev.filter((m) => m.id !== mold.id));
    setTotal((prev) => prev - 1);
  };

  const createNewMold = async (data) => {
    const normalizedData = {
      ...data,
      quantity: data.quantity ? Number(data.quantity) : undefined,
    };

    await createMold(normalizedData);
  };

  return {
    molds,
    total,
    loading,
    fetchMolds,
    removeMold,
    createNewMold,
  };
}
