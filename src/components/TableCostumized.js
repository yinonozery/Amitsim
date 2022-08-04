import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableBody,
  TableCell,
} from "@material-ui/core";
import { useState } from "react";

const TableCostumized = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const TableHeaders = props.columns.map((column) => (
    <TableCell
      key={column.id}
      align={column.align}
      style={{
        minWidth: column.minWidth,
        backgroundColor: props.color,
        fontSize: ".8rem",
        fontFamily: "Open Sans, sans-serif",
      }}
    >
      {column.label}
    </TableCell>
  ));

  const TableContent = props.rows
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row, index) => {
      return (
        <TableRow
          hover
          key={index}
          role="checkbox"
          tabIndex={-1}
        >
          {props.columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell
                key={column.id}
                align={column.align}
                style={{
                  fontSize: ".8rem",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });

  return (
    <div>
      <Paper
        elevation={1}
        sx={{ width: "100%", overflow: "hidden" }}
        style={{ borderRadius: 10 }}
      >
        <TableContainer sx={{ maxHeight: 440 }} style={{ borderRadius: 10 }}>
          <Table>
            <TableHead>
              <TableRow>{TableHeaders}</TableRow>
            </TableHead>
            <TableBody>{TableContent}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            direction: "ltr",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Paper>
    </div>
  );
};

export default TableCostumized;
