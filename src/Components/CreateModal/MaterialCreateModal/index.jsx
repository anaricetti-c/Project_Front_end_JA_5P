import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useUtils from "../../../hooks/useUtils";

export default function MaterialCreateModal({ open, onClose, onSubmit }) {
  const wrapperRef = useRef(null);

  const { fetchUtils, timeUnit } = useUtils();
  useEffect(() => {
    fetchUtils();
  }, []);

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
      size: 12
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
      size: 6,
    },
    {
      name: "unit_of_measure",
      label: "Unidade de Medida",
      type: "text",
      required: false,
      size: 6,
    },
    {
      name: "time_quantity",
      label: "Quantidade de Tempo para Reposição",
      type: "number",
      required: true,
    },
    {
      name: "time_unit",
      label: "Unidade de Tempo para Reposição",
      type: "select",
      selectMode: "normal",
      required: true,
      options: timeUnit.map((tu) => ({
        label: tu,
        value: tu,
      })),
    },
  ];

  const handleSubmit = (formData) => {
    onSubmit({ ...formData });
  };

  return (
    <GenericCreateModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Criar Material"
      fields={fields}
    ></GenericCreateModal>
  );
}
