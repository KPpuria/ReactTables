import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import Table2 from "./table2";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
      setData(result.data);
      console.log(result.data);
    })();
  }, []);

  return (
    <div className="App">
      {/* <Table columns={columns} data={data} /> */}
      {/* <Table2 table_props={data} data={data} /> */}
      <h1>HI</h1>
    </div>
  );
}

export default App;
