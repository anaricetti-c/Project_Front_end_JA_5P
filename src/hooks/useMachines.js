import { useState, useCallback } from "react";
import { listMachines, deleteMachine, createMachine } from "../services/machineService";
import { cleanFormData } from "../utils/format";

export default function useMachines(pageSize) {
  const [machines, setMachines] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMachines = useCallback(
    async ({ page, field, value }) => {
      setLoading(true);
      const { data, metadata } = await listMachines({
        page,
        pageSize,
        field,
        value,
      });

      setMachines(data);
      setTotal(metadata.total);
      setLoading(false);
    },
    [pageSize]
  );

  const removeMachine = async (machine) => {
    await deleteMachine(machine.id);
    setMachines((prev) => prev.filter((m) => m.id !== machine.id));
    setTotal((prev) => prev - 1);
  };

  const createNewMachine = async (data) => {
    data.lead_time = `${data.time_quantity} ${data.time_unit}`;
    const normalizedData = {
      ...data,
      stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : undefined,
    };
    const cleanedData = cleanFormData(normalizedData);
    await createMachine(cleanedData);
  };

  return {
    machines,
    total,
    loading,
    fetchMachines,
    removeMachine,
    createNewMachine,
  };
}
