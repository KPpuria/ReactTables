import React, { useState, useEffect } from "react";
import DataGrid from "react-data-grid";

const DataTable = (props) => {
  const [column, setColumn] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    setColumn(() => {
      let x = props.table_props.columns.map((column_name) => {
        let column_obj = { ...props.table_props.c_props[column_name] };
        column_obj["key"] = column_name;
        column_obj["name"] = column_name;
        return column_obj;
      });
      return x;
    });
  }, [props]);

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      // rowGetter = {i => filteredRows[i]}                                #######  Replaced By ########
      // rowsCount = {filteredRows.length < 30 ? filteredRows.length : 30} #######    "rows"    ########
      onRowsUpdate={() => {
        onGridRowsUpdated();
      }}
      // enableCellSelect -> reomved in v7
      onSort={(sortColumn, sortDirection) =>
        setRowState(sortRows(props.data, sortColumn, sortDirection))
      }
    />
  );
};
