import React, { useRef } from "react";
import Index from "../../src/index.tsx"; // dynamic changes
import { menuGroup } from "./constants.js";
// import Index from "../../dist/bundle";
import "./styles.css";

const App = () => {
  const ref = useRef();
  const fetchSelectionItemsLabels = () => {
    console.log(
      "get selections as label array",
      ref.current?.getAllItemsSelected()
    );
  };
  const fetchSelectionItems = () => {
    console.log("get selections", ref.current?.getSelection());
  };
  const fetchSelectionItemsAtSplit = () => {
    console.log(
      "get selection by split",
      ref.current?.getAllItemsSelectedBySplit()
    );
  };
  return (
    <div style={{ width: "65vw", height: "50vh" }}>
      <Index
        ref={ref}
        menuGroup={menuGroup}
        isMultiSelection={true}
        displayValue="value"
      />
      <br />
      <br />

      <button className="btn" onClick={fetchSelectionItems}>
        get selections
      </button>
      <button className="btn" onClick={fetchSelectionItemsLabels}>
        get selections as label array
      </button>
      {/* <button onClick={fetchSelectionItemsAtSplit}>
        get selections as label array at split
      </button> */}
    </div>
  );
};

export default App;
