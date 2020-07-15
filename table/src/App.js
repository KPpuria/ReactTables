import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

import TableComponent from "./tableComponent"

function App() {
  const [data, setData] = useState([]);
  const value = 'Bearer xchn23YC9BlwGyPjCJZf0v46GAFgkj'

  useEffect(() => {
    (async () => {
      const result = await axios("https://jsonplaceholder.typicode.com/posts");
      setData(data => data.concat(result.data));
      // const result = await axios.get("http://206.189.133.241/hr/emp_mast/", {'Authorization': value});
    })();
  }, []);

  const table_props = { columns: [ 'id', 'userId', 'title', 'body'],
    c_props:{
              userId: {filter: "fuzzyText" },
              id: {filter: "fuzzyText" , aggregate: 'count',  Aggregated: ({ value }) => `${value}`,},
              title: {filter: "fuzzyText" , aggregate: 'uniqueCount',  Aggregated: ({ value }) => `${value} Unique titles`,},
              body: {filter: "fuzzyText" }
            }
  }

  // const table_props = { columns: [ 'id', 'userId', 'title'],
  //   c_props:{
  //             userId: {filter: "fuzzyText" },
  //             id: {filter: "fuzzyText" , aggregate: 'count',  Aggregated: ({ value }) => `${value}`,},
  //             title: {filter: "fuzzyText" , aggregate: 'uniqueCount',  Aggregated: ({ value }) => `${value} Unique titles`,},
  //           }
  // }

  return (
    <div className="App">
      <TableComponent table_props={table_props} data={data}/>
    </div>
  );
}

export default App;
