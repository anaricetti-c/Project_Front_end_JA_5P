import { Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

import {
  defaultMenuItemStyle,
  defaultSelectStyle,
} from "../../styles/muiStyles.js";
import { formatLabel } from "../../utils/format.jsx";
import { sortFieldsByDotPriority } from "../../utils/sort.jsx";
import { api } from "../../services/api.jsx"; // ajuste o path
import { getHeaders } from "../../services/headers.jsx"; // ajuste o path

/**
 * Componente reutilizável de Select estilizado
 * @param {string} defaultText - Texto padrão do MenuItem vazio
 * @param {string} selectedFilter - Valor selecionado
 * @param {(value: string) => void} setSelectedFilter - Função para atualizar o valor
 * @param {string} model - Nome do modelo para buscar os filtros
 * @param {(value: string) => string} formatText - Função para formatar o texto da opção
 */
export default function CustomSelect({
  defaultText = "Filtro",
  selectedFilter,
  setSelectedFilter,
  model,
  formatText = formatLabel,
  menuItemStyle = defaultMenuItemStyle,
  selectStyle = defaultSelectStyle,
}) {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    if (model) fetchFilters();
  }, [model]);

  async function fetchFilters() {
    try {
      const filtersResponse = await api.get("/utils/filter_fields", {
        headers: getHeaders(),
        params: { model },
      });

      const sortedFilters = sortFieldsByDotPriority(
        filtersResponse.data.filter_fields
      );
      setFilters(sortedFilters);
    } catch (error) {
      console.error("Erro ao buscar filtros:", error);
    }
  }

  return (
    <Select
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value)}
      displayEmpty
      size="small"
      sx={selectStyle}
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            mt: 1,
          },
        },
      }}
      renderValue={(selected) => {
        if (!selected) {
          return <em>Filtro</em>; // texto padrão quando nada estiver selecionado
        }
        return formatText(selected);
      }}
    >
      {/* <MenuItem value="" sx={{ fontStyle: "italic", color: "#777" }}>
        {defaultText}
      </MenuItem> */}

      {filters.length > 0 ? (
        filters.map((f) => (
          <MenuItem key={f} value={f} sx={menuItemStyle}>
            {formatText(f)}
          </MenuItem>
        ))
      ) : (
        <MenuItem key="no-options" value="" disabled sx={{ color: "#aaa" }}>
          Nenhum filtro disponível
        </MenuItem>
      )}
    </Select>
  );
}
