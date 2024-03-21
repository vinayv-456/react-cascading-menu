import React, { useRef } from "react";
import Index from "../../src/index.tsx"; // dynamic changes
import { menuGroup } from "./constants.js";
// import Index from "../../dist/bundle";

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
  return (
    <div>
      <Index
        ref={ref}
        menuGroup={menuGroup}
        isMultiSelection={true}
        displayValue="value"
      />
      <button onClick={fetchSelectionItems}>get selections</button>
      <button onClick={fetchSelectionItemsLabels}>
        get selections as label array
      </button>
    </div>
  );
};

export default App;
