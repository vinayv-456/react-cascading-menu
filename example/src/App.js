import React from "react";
import Index from "../../src/index.tsx"; // dynamic changes
// import Index from "../../dist/bundle";

const App = () => {
  const options = [
    { label: "Hyderabad-label", value: "Hyderabad-value" },
    { label: "Vizag", value: "Vizag" },
    { label: "Chennai", value: "Chennai" },
    { label: "Benagaluru", value: "Benagaluru" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Pune-label", value: "Pune-value" },
  ];
  return (
    <div>
      <Index options={options} displayValue="value" />
    </div>
  );
};

export default App;
