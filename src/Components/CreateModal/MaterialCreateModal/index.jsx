import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useUtils from "../../../hooks/useUtils";

import { toast } from "react-toastify";

export default function MaterialCreateModal({ open, onClose, onSubmit }) {
  const wrapperRef = useRef(null);

  const { fetchUtils, timeUnit } = useUtils();
  useEffect(() => {
    fetchUtils();
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fields = [
    {
      name: "name",
      label: "Código",
      type: "number",
      required: false,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      required: false,
    },
    {
      name: "stock_quantity",
      label: "Quantidade em Estoque",
      type: "number",
      required: false,
    },
    {
      name: "unit_of_measure",
      label: "Unidade de Medida",
      type: "text",
      required: false,
    },
    {
      name: "time_unit",
      label: "Unidade de Tempo para Reposição",
      type: "select",
      required: true,
      options: timeUnit.map((tu) => ({
        label: tu,
        value: tu,
      })),
    },
    {
      name: "time_quantity",
      label: "Quantidade de Tempo para Reposição",
      type: "number",
      required: true,
    },
  ];

  const handleSubmit = (formData) => {
    if (!selectedMold) {
      toast.warning("Selecione um molde válido!");
      return;
    }
    console.log(timeUnit);

    onSubmit({ ...formData });
    setSelectedMold(null);
    setShowDropdown(false);
    setMoldQuery("");
  };

  return (
    <GenericCreateModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Criar Peça"
      fields={fields}
    ></GenericCreateModal>
  );
}
