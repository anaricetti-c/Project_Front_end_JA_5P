import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

export default function GenericCreateModal({
  title = "Criar Item",
  fields = [],
  onSubmit,
  onClose,
  open = false,
  children,
}) {
  const [formData, setFormData] = useState(
    Object.fromEntries(
      fields.map((f) => {
        if (f.type === "checkbox") return [f.name, false];
        return [f.name, ""];
      })
    )
  );
  const [filteredOptions, setFilteredOptions] = useState({});
  const [inputLabels, setInputLabels] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const modalRef = useRef();
  const dropdownRefs = useRef({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    const field = fields.find((f) => f.name === name);
    if (field?.type === "select") {
      const filtered = field.options.filter((opt) =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions((prev) => ({ ...prev, [name]: filtered }));
      setInputLabels((prev) => ({ ...prev, [name]: value }));
      setIsDropdownOpen((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleOptionSelect = (fieldName, option) => {
    setFormData((prev) => ({ ...prev, [fieldName]: option.value }));
    setInputLabels((prev) => ({ ...prev, [fieldName]: option.label }));
    setFilteredOptions((prev) => ({ ...prev, [fieldName]: [] }));
    setIsDropdownOpen((prev) => ({ ...prev, [fieldName]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    const initialFormData = Object.fromEntries(
      fields.map((f) => {
        if (f.type === "checkbox") return [f.name, false];
        return [f.name, ""];
      })
    );
    setFormData(initialFormData);
    setInputLabels({});
    setFilteredOptions({});
    setIsDropdownOpen({});
  };

  useEffect(() => {
    if (open) {
      const initialFormData = Object.fromEntries(
        fields.map((f) => {
          if (f.type === "checkbox") return [f.name, false];
          return [f.name, ""];
        })
      );
      setFormData(initialFormData);
      setInputLabels({});
      setFilteredOptions({});
      setIsDropdownOpen({});
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Fecha dropdowns
      fields.forEach((field) => {
        if (field.type === "select") {
          const ref = dropdownRefs.current[field.name];
          if (ref && !ref.contains(e.target)) {
            setIsDropdownOpen((prev) => ({ ...prev, [field.name]: false }));
          }
        }
      });

      // Fecha modal
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fields, open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div ref={modalRef} className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => (
            <div key={field.name} className={styles.inputGroup}>
              {field.type !== "checkbox" && (
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required && (
                    <span className={styles.required}> *</span>
                  )}
                </label>
              )}

              {field.type === "select" ? (
                <div
                  className={styles.autocompleteWrapper}
                  ref={(el) => (dropdownRefs.current[field.name] = el)}
                >
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={inputLabels[field.name] || ""}
                    onChange={handleChange}
                    onFocus={() =>
                      setIsDropdownOpen((prev) => ({
                        ...prev,
                        [field.name]: true,
                      }))
                    }
                    placeholder={field.placeholder || "Digite para buscar"}
                    required={field.required}
                    autoComplete="off"
                  />
                  {isDropdownOpen[field.name] &&
                    filteredOptions[field.name]?.length > 0 && (
                      <ul className={styles.optionsList}>
                        {filteredOptions[field.name].map((opt) => (
                          <li
                            key={opt.value}
                            onClick={() => handleOptionSelect(field.name, opt)}
                          >
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder || ""}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  rows={field.rows || 2}
                />
              ) : field.type === "checkbox" ? (
                <label className={styles.container}>
                  {field.label}
                  <input
                    id={field.name}
                    name={field.name}
                    checked={!!formData[field.name]}
                    type="checkbox"
                    onChange={handleChange}
                  />
                  <div className={styles.checkmark}></div>
                </label>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder || ""}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {children && <div className={styles.inputGroup}>{children}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
