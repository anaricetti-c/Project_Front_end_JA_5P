import { Pagination } from "@mui/material";

import { defaultPaginationStyle } from "../../styles/muiStyles.js";

export default function CustomPagination({
  search,
  setSearch,
  total = 0,
  pageSize = 15,
  paginationStyle = defaultPaginationStyle,
}) {
  const handlePageChange = (_, page) => {
    setSearch((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };
  return (
    <Pagination
      page={Number(search.get("page"))}
      size="small"
      count={Math.ceil(total / pageSize)}
      onChange={handlePageChange}
      sx={paginationStyle}
    />
  );
}
