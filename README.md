# React Cascading Menu

**Cascading Menu** is a multi-selectable cascading menu component for React. It enhances user experience and navigation efficiency with the following features:

- **Navigation Efficiency**: Searching and selecting options in traditional dependent dropdowns is difficult and time-consuming as the user needs to navigate through multiple dropdowns. Cascading Menu provides easy access to options through interactive selection or global search, making selection faster and more efficient.
- **Enhanced User Experience**: Understanding relationships between options in dependent dropdowns can be challenging. Cascading Menu provides a clear visual representation of the option hierarchy.

## Features

1. Layout Mode/Orientation
2. Visual Hierarchy and Context Clarity
3. Tag-Based Navigation and Deletion
4. Interactive Selection and Deletion
5. Search Capability
6. Multi/Single-Select Flexibility at Each Level
7. Maintains Selection Order
8. Theme Customization Options

## Demo

![updated_rc mp4](https://github.com/user-attachments/assets/159c9e0e-5474-4099-ba03-36272d9eab09)

### Installation

```sh
npm install react-cascading-menu
```

### Example Usage

```jsx
import React, { useRef, useState } from "react";
import ReactCascadingMenu from "react-cascading-menu";
import { menuGroup } from "./data.js";

const CascadingMenu = () => {
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

  const changeLayout = () => {
    setLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
  };

  return (
    <>
      <ReactCascadingMenu
        layout={layout}
        ref={ref}
        menuGroup={menuGroup}
        // selectedItems={preSelectedItems}
        isMultiSelection={true}
        displayValue="label"
        width={layout === "vertical" ? "40vw" : "60vw"}
        height="400px"
        theme="light"
      />
      <br />
      <button className="btn" onClick={fetchSelectionItems}>
        get selections
      </button>
      <button className="btn" onClick={fetchSelectionItemsLabels}>
        get selections as label array
      </button>
      <span>(Check console logs for results)</span>
      <div className="md-top">
        <button className="btn" onClick={changeLayout}>
          Change layout
        </button>
      </div>
    </>
  );
};

export default CascadingMenu;
```

### Data Example

```jsx
const menuGroup = {
  id: "1_101",
  groupHeading: "Country",
  options: [
    {
      id: "2_101",
      label: "United States",
      value: "United States",
      groupHeading: "State",
      options: [
        {
          id: "3_101",
          label: "New York",
          value: "New York",
          groupHeading: "City",
          options: [
            {
              id: "4_101",
              label: "New York City",
              value: "New York City",
              groupHeading: "Place",
              isMultiSelection: false,
              options: [
                {
                  id: "5_101",
                  label: "Statue of Liberty",
                  value: "Statue of Liberty",
                },
                {
                  id: "5_102",
                  label: "Central Park",
                  value: "Central Park",
                },
                {
                  id: "5_103",
                  label: "Empire State Building",
                  value: "Empire State Building",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

## Screenshots

![1_rc](https://github.com/user-attachments/assets/aa80d7ef-f008-4807-8ad4-87a5ccac2ad4)
![2_rc_new](https://github.com/user-attachments/assets/894fbef2-f564-444f-b9ee-4620acc7febd)
