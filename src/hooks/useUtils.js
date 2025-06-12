import { useState, useCallback } from "react";
import { listCountry, listTimeUnit, listFilterFields } from "../services/utilsService";
import { toast } from "react-toastify";

export default function useUtils() {
  const [timeUnit, setTimeUnit] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filterFields, setFilterFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUtils = useCallback(async (model = "") => {
    setLoading(true);
    try {
      const [countriesRes, timeUnitRes, filterFieldsRes] = await Promise.all([
        listCountry(),
        listTimeUnit(),
        listFilterFields({ model }),
      ]);

      setCountries(countriesRes.countries || []);
      setTimeUnit(timeUnitRes.time_unit || []);
      setFilterFields(filterFieldsRes.filter_fields || []);
    } catch (error) {
      toast.error("Erro ao carregar dados utilitários.");
      console.error("Erro ao buscar dados utilitários:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    timeUnit,
    countries,
    filterFields,
    loading,
    fetchUtils,
  };
}
