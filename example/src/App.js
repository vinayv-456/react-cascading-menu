import React, { useRef, useState } from "react";
import ReactCascadingMenu from "react-cascading-menu"; // Always use built package
// import { menuGroup, preSelection } from "./constants.js";
import { menuGroup, preSelection } from "../../data/constants.js";
import "./styles.css";

const App = () => {
  const ref = useRef();
  const [layout, setLayout] = useState("vertical");
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
  const changeLayout = () => {
    setLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
  };
  return (
    <div>
      <ReactCascadingMenu
        ref={ref}
        menuGroup={menuGroup}
        // selectedItems={preSelection}
        isMultiSelection={true}
        displayValue="value"
        width={layout === "vertical" ? "40%" : "60%"}
        theme="light"
        layout={layout}
      />
      {/* <br /> */}
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
      <div className="md-top">
        <button className="btn " onClick={changeLayout}>
          Change layout
        </button>
      </div>
    </div>
  );
};

export default App;
