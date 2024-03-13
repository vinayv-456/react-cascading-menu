import React from "react";
import Index from "../../src/index.tsx"; // dynamic changes
import { menuGroup } from "./constants.js";
// import Index from "../../dist/bundle";

const App = () => {
  return (
    <div>
      <Index
        menuGroup={menuGroup}
        isMultiSelection={true}
        displayValue="value"
      />
    </div>
  );
};

export default App;
