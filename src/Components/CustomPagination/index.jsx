import { Pagination } from "@mui/material";

import { defaultPaginationStyle } from "../../Styles/mui_styles.jsx";

export default function CustomPagination({
  search,
  setSearch,
  total = 0,
  pageSize = 15,
  paginationStyle = defaultPaginationStyle,
}) {
  const handlePageChange = (_, page) => {
    setSearch({ page: page.toString() });
  };
  return (
    <Pagination
      page={Number(search.get("page"))}
      size="large"
      count={Math.ceil(total / pageSize)}
      onChange={handlePageChange}
      sx={paginationStyle}
    />
  );
}
