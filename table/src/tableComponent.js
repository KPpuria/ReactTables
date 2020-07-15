import React, { useEffect, useState } from "react";
import Table from "./table";
import { Styles } from "./styles";

function TableComponent(props) {
  const [column, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data);
    setColumns(columnsSetter);
  }, [props]);

  function columnsSetter() {
    const x = props.table_props.columns.map((column_name) => {
      let column_obj = { ...props.table_props.c_props[column_name] };
      column_obj["Header"] = column_name;
      column_obj["accessor"] = column_name;
      return column_obj;
    });
    return x;
  }

  const columns = React.useMemo(() => column, []);

  const [originalData] = React.useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [data]);

  const resetData = () => setData(originalData);

  return (
    <Table
      columns={column}
      data={data}
      updateMyData={updateMyData}
      skipPageReset={skipPageReset}
    />
  );
}

export default TableComponent;
