import { useState, useEffect, useRef } from "react";
import GenericCreateModal from "../../GenericCreateModal";
import useMolds from "../../../hooks/useMolds";

import styles from "./style.module.css";
import { toast } from "react-toastify";

export default function PartCreateModal({ open, onClose, onSubmit }) {
  const [moldQuery, setMoldQuery] = useState("");
  const [selectedMold, setSelectedMold] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);
  const { molds, fetchMolds } = useMolds(15);

  useEffect(() => {
    if (moldQuery.length < 2) {
      setShowDropdown(false);
      return;
    }

    fetchMolds({ page: 1, field: "mold.name", value: moldQuery }).then(() => {
      setShowDropdown(true);
    });
  }, [moldQuery, fetchMolds]);

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
      name: "model_3d",
      label: "Modelo 3D",
      type: "checkbox",
    },
    {
      name: "nc_program",
      label: "Programa NC",
      type: "checkbox",
    },
    { name: "quantity", label: "Quantidade", type: "number", required: false },
  ];

  const handleSubmit = (formData) => {
    if (!selectedMold) {
      toast.warning("Selecione um molde válido!");
      return;
    }
    console.log(formData);

    onSubmit({ ...formData, mold_id: selectedMold.id });
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
    >
      <div ref={wrapperRef} className={styles.autocompleteWrapper}>
        <label>
          Molde
          <span className={styles.required}> *</span>
        </label>
        <input
          type="text"
          placeholder="Busque o molde..."
          value={moldQuery}
          onChange={(e) => {
            setMoldQuery(e.target.value);
            setSelectedMold(null);
          }}
          onFocus={() => {
            if (molds.length > 0) setShowDropdown(true);
          }}
        />
        {showDropdown && molds.length > 0 && (
          <ul className={styles.optionsList}>
            {molds.map((opt) => (
              <li
                key={opt.id}
                onClick={() => {
                  setSelectedMold(opt);
                  setMoldQuery(opt.name);
                  setShowDropdown(false);
                }}
                style={{ cursor: "pointer", padding: 4 }}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </GenericCreateModal>
  );
}
