import React from "react";

import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  Chip,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { lighten, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    toggleFilter,
    columnSelectorHandler,
    columnList,
    // addUserHandler,
    // deleteUserHandler,
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {/* <AddUserDialog addUserHandler={addUserHandler} /> */}
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Users {/*do with props .table name later*/}
        </Typography>
      )}

      <Tooltip title="Select columns to Hide">
        {/* <Autocomplete
          multiple
          id="tags-outlined"
          options={columnList}
          getOptionLabel={(option) => option.title}
          defaultValue={"--"}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="filterSelectedOptions"
              placeholder="Column Name  "
            />
          )}
        /> */}
        {/* <Autocomplete
          multiple
          id="tags-filled"
          options={columnList.map((option) => option.Header)}
          defaultValue={" "}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Select Columns"
              placeholder="Column Name"
            />
          )}
        /> */}
        <Select>
          {columnList.map((columnName) => {
            return (
              <MenuItem value={columnName.Header}>{columnName.Header}</MenuItem>
            );
          })}
        </Select>
      </Tooltip>

      <Tooltip title="Toogle Filters">
        <IconButton aria-label="filter" onClick={toggleFilter}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          disabled={numSelected > 0 ? false : true}
          aria-label="delete" /*onClick={deleteUserHandler}*/
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  //   columnSelectorHandler: PropTy?pes.func.isRequired,
  columnList: PropTypes.array.isRequired,
  //   addUserHandler: PropTypes.func.isRequired,
  //   deleteUserHandler: PropTypes.func.isRequired,
};

export default TableToolbar;
