import { useState, useCallback } from "react";
import { listMaterials, deleteMaterial, createMaterial } from "../services/materialService";

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
    // const normalizedData = {
    //   ...data,
    //   quantity: data.quantity ? Number(data.quantity) : undefined,
    // };
    await createMaterial(data);
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
