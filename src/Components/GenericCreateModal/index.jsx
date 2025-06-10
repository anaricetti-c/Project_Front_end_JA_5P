import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

export default function GenericCreateModal({
  title = "Criar Item",
  fields = [],
  onSubmit,
  onClose,
  open = false,
}) {
  const [formData, setFormData] = useState(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const modalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(Object.fromEntries(fields.map((f) => [f.name, ""])));
  };
  // Fecha o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div ref={modalRef} className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => (
            <div key={field.name} className={styles.inputGroup}>
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className={styles.required}> *</span>}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Selecione</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
