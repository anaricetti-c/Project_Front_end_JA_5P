import { Select, MenuItem } from "@mui/material";

import { formatLabel } from "../../Utils/format.jsx";
import {
  defaultMenuItemStyle,
  defaultSelectStyle,
} from "../../Styles/mui_styles.jsx";

/**
 * Componente reutilizável de Select estilizado
 * @param {string} defaultText - Texto padrão do MenuItem vazio
 * @param {string} selectedFilter - Valor selecionado
 * @param {(value: string) => void} setSelectedFilter - Função para atualizar o valor
 * @param {string[]} filters - Lista de opções
 * @param {(value: string) => string} formatLabel - Função para formatar o texto da opção
 */
export default function CustomSelect({
  defaultText = "Filtro",
  selectedFilter,
  setSelectedFilter,
  filters = [],
  formatText = formatLabel,
  menuItemStyle = defaultMenuItemStyle,
  selectStyle = defaultSelectStyle,
}) {
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
    >
      <MenuItem value="" disabled sx={{ fontStyle: "italic", color: "#777" }}>
        {defaultText}
      </MenuItem>

      {filters.length > 0 ? (
        filters.map((f, index) => (
          <MenuItem key={index} value={f} sx={menuItemStyle}>
            {formatText(f)}
          </MenuItem>
        ))
      ) : (
        <MenuItem key="default" value="" disabled sx={{ color: "#aaa" }}>
          Nenhum filtro disponível
        </MenuItem>
      )}
    </Select>
  );
}
