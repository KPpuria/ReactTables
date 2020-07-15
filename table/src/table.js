import React, { useState } from "react";
import {
  Table as MTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableFooter,
  Checkbox,
  Paper,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
} from "react-table";
import matchSorter from "match-sorter";
import TableToolbar from "./toolbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.black,
    fontSize: 20,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    margin: 0,
  },
});

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function useControlledState(state, { instance }) {
  return React.useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      };
    }
    return state;
  }, [state]);
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: "transparent",
};

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      style={inputStyle}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

//to trigger column show-hide
const toggleColumnHiding = () => {
  return;
};

function Table({ columns, data, updateMyData, skipPageReset }) {
  const styleClasses = useStyles();

  const [filterState, toggleFiltering] = useState(false);

  const toggleFilteringHandler = () => {
    toggleFiltering(!filterState);
  };

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Cell: EditableCell,
      // default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
      filterTypes,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    // useBlockLayout,
    // useResizeColumns,
    (hooks) => {
      hooks.useControlledState.push(useControlledState);
      hooks.visibleColumns.push((columns, { instance }) => {
        if (!instance.state.groupBy.length) {
          return columns;
        }

        return [
          {
            id: "expander", // Make sure it has an ID
            // Build our expander column
            Header: ({ allColumns, state: { groupBy } }) => {
              return groupBy.map((columnId) => {
                const column = allColumns.find((d) => d.id === columnId);

                return (
                  <span {...column.getHeaderProps()}>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? " ☑ " : " ☐ "}
                      </span>
                    ) : null}
                    {column.render("Header")}{" "}
                  </span>
                );
              });
            },
            Cell: ({ row }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find((d) => d.isGrouped);

                return (
                  <span
                    {...row.getToggleRowExpandedProps({
                      style: {
                        // We can even use the row.depth property
                        // and paddingLeft to indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 2}rem`,
                      },
                    })}
                  >
                    {row.isExpanded ? <ExpandMoreIcon /> : <ArrowRightIcon />}{" "}
                    {groupedCell.render("Cell")} ({row.subRows.length})
                  </span>
                );
              }

              return null;
            },
          },
          ...columns,
        ];
      });
      hooks.allColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Render the UI for your table
  return (
    <>
      <TableContainer component={Paper}>
        <TableToolbar
          numSelected={Object.keys(selectedRowIds).length}
          toggleFilter={toggleFilteringHandler}
          // columnSelectorHandler={toggleColumnHiding}
          columnList={columns}
        />
        <MTable
          className={styleClasses.table}
          size="small"
          {...getTableProps()}
        >
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <StyledTableCell {...column.getHeaderProps()}>
                    <div /*...column.getResizerProps()*/>
                      {column.canGroupBy ? (
                        // If the column can be grouped toggle is added
                        <span {...column.getGroupByToggleProps()}>
                          {column.isGrouped ? " ☑ " : " ☐ "}
                        </span>
                      ) : null}
                      <span {...column.getSortByToggleProps()}>
                        {column.render("Header")}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </div>
                    {filterState ? (
                      <div>
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    ) : null}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <StyledTableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <StyledTableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableCell align="center" colSpan={columns.length + 1}>
              <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>{" "}
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {">"}
                </button>{" "}
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>{" "}
                <span>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <span>
                  | Go to page:{" "}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "100px" }}
                  />
                </span>{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 15, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </TableCell>
          </TableFooter>
        </MTable>
      </TableContainer>
    </>
  );
}

export default Table;
