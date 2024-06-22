import React, { useRef } from "react";
import Index from "../../src/index.tsx"; // dynamic changes
import { menuGroup, preSelection } from "./constants.js";
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
    <div>
      <Index
        ref={ref}
        menuGroup={menuGroup}
        // selectedItems={preSelection}
        isMultiSelection={true}
        displayValue="value"
        width="60%"
        height="400px"
        theme="light"
      />
      <br />
      <br />

      <button className="btn" onClick={fetchSelectionItems}>
        get selections
      </button>
      <button className="btn" onClick={fetchSelectionItemsLabels}>
        get selections as label array
      </button>
      <span>(Check console logs for results)</span>
      {/* <button onClick={fetchSelectionItemsAtSplit}>
        get selections as label array at split
      </button> */}
    </div>
  );
};

export default App;
