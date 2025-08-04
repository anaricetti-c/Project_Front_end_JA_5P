import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useMachines from "../../../hooks/useMachines";

import styles from "./style.module.css";
import { toast } from "react-toastify";

export default function OperationCreateModal({ open, onClose, onSubmit }) {

  const wrapperRef = useRef(null);

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
      name: "m_type",
      label: "Nome",
      type: "text",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      default: true,
      selectMode: "normal",
      required: true,
      options: [
        { label: 'Available', value: 'Available', selected: true },
        { label: 'Under Maintenance', value: 'Under Maintenance' },
        { label: 'Out of Service', value: 'Out of Service' },
      ],
    },
  ];

  return (
    <GenericCreateModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Criar Máquina"
      fields={fields}
    >
    </GenericCreateModal>
  );
}
