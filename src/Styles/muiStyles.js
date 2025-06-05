export const defaultMenuItemStyle = {
  fontSize: 14,
  padding: "8px 14px",
  "&.Mui-selected": {
    backgroundColor: "#28a745",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#218838",
    },
  },
};

export const defaultSelectStyle = {
  fontSize: 14,
  fontWeight: 400,
  padding: "8px 10px",
  minWidth: 120,
  height: "38px",
  marginRight: "10px",
  backgroundColor: "#fff",
  borderRadius: "6px",
  border: "1px solid #ccc",
  color: "#333",
  "& .MuiSelect-select": {
    padding: "8px 10px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover": {
    borderColor: "#28a745",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #28a745",
  },
};

export const defaultPaginationStyle = {
  paddingTop: "10px",
  alignSelf: "center",
  "& .MuiPaginationItem-root": {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 500,
    color: "#333",
    border: "1px solid transparent",
    transition: "all 0.3s ease",
    minWidth: "36px",
    height: "36px",
    margin: "0 4px",
  },
  "& .MuiPaginationItem-root:hover:not(.Mui-selected)": {
    backgroundColor: "#f1f3f5",
    borderColor: "#28a745",
    color: "#28a745",
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    backgroundColor: "#28a745",
    color: "#fff",
    borderColor: "#28a745",
    fontWeight: 600,
    boxShadow: "0 2px 5px rgba(40, 167, 69, 0.4)",
  },
  "& .MuiPaginationItem-root.Mui-disabled": {
    color: "#ccc",
    borderColor: "transparent",
  },
};
