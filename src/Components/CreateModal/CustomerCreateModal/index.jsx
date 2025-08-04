import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useUtils from "../../../hooks/useUtils";

export default function CustomerCreateModal({ open, onClose, onSubmit }) {
  const wrapperRef = useRef(null);

  const { fetchUtils, countries } = useUtils();
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
      name: "full_name",
      label: "Nome",
      type: "text",
      required: true,
      size: 12
    },
    {
      name: "country_name",
      label: "País",
      type: "select",
      selectMode: "normal",
      required: true,
      options: countries.map((c) => ({
        label: c,
        value: c,
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
      title="Criar Cliente"
      fields={fields}
    ></GenericCreateModal>
  );
}
