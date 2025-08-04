import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useMachines from "../../../hooks/useMachines";

import styles from "./style.module.css";
import { toast } from "react-toastify";

export default function OperationCreateModal({ open, onClose, onSubmit }) {
  const [machineQuery, setMachineQuery] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);
  const { machines, total, fetchMachines } = useMachines(15);

  useEffect(() => {
    if (machineQuery.length < 2) {
      setShowDropdown(false);
      return;
    }

    fetchMachines({ page: 1, field: "machine.m_type", value: machineQuery }).then(() => {
      setShowDropdown(true);
    });
  }, [machineQuery, fetchMachines]);

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
      name: "op_type",
      label: "Nome",
      type: "text",
      required: true,
    }
  ];

  const handleSubmit = (formData) => {
    console.log(formData);

    onSubmit({ ...formData, machine_id: selectedMachine ? selectedMachine.id : null});
    setSelectedMachine(null);
    setShowDropdown(false);
    setMachineQuery("");
  };

  return (
    <GenericCreateModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Criar Operação"
      fields={fields}
    >
      <div ref={wrapperRef} className={styles.autocompleteWrapper}>
        <label>
          Maquina
        </label>
        <input
          type="text"
          placeholder="Busque pelo nome da maquina..."
          value={machineQuery}
          onChange={(e) => {
            setMachineQuery(e.target.value);
            setSelectedMachine(null);
          }}
          onFocus={() => {
            if (machines.length > 0) setShowDropdown(true);
          }}
        />
        {showDropdown && machines.length > 0 && (
          <ul className={styles.optionsList}>
            {machines.map((opt) => (
              <li
                key={opt.id}
                onClick={() => {
                  setSelectedMachine(opt);
                  setMachineQuery(opt.m_type);
                  setShowDropdown(false);
                }}
                style={{ cursor: "pointer", padding: 4 }}
              >
                {opt.m_type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </GenericCreateModal>
  );
}
