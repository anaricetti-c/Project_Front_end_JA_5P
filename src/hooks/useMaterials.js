import { useState, useCallback } from "react";
import { listMaterials, deleteMaterial, createMaterial } from "../services/materialService";
import { cleanFormData } from "../utils/format";

export default function useMaterials(pageSize) {
  const [materials, setMaterials] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listMaterials({
        page,
        pageSize,
        field,
        value,
      });

      setMaterials(data);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  const removeMaterial = async (material) => {
    await deleteMaterial(material.id);
    setMaterials((prev) => prev.filter((m) => m.id !== material.id));
    setTotal((prev) => prev - 1);
  };

  const createNewMaterial = async (data) => {
    data.lead_time = `${data.time_quantity} ${data.time_unit}`;
    const normalizedData = {
      ...data,
      stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : undefined,
    };
    // const cleanedData = cleanFormData(normalizedData);
    await createMaterial(normalizedData);
  };

  return {
    materials,
    total,
    loading,
    fetchMaterials,
    removeMaterial,
    createNewMaterial,
  };
}
