import React from 'react'
import Table from './FTable'
import {Styles} from './styles'

function Table2(props) {

  const [column, setColumns] = React.useState({})
  const [data, setData] = React.useState(props.data)
  const [originalData] = React.useState(data)

  setColumns(() => {
    column = props.table_props.columns.map(column_name => {
        let column_obj = {...props.table_props.c_props['column_name']}
        column_obj['Header'] = "column_name"
        column_obj['accessor'] = "column_name"
        column_obj['filter'] = "fuzzyText"
        return column_obj
      });
      return column
    }
  );

  const columns = React.useMemo(
    () => [column], []
  )


  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false)

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    skipResetRef.current = false
  }, [data])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => {
    // Don't reset the page when we do this
    skipResetRef.current = true
    setData(originalData)
  }

  return (
    <Styles>
      <button onClick={resetData}>Reset Data</button>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipReset={skipResetRef.current}
      />
    </Styles>
  )
}

export default Table2
