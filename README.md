# React Cascading Menu

**Cascading Menu** is a multi-selectable cascading menu component for React. It enhances user experience and navigation efficiency with the following features:

## Features
1. Visual Hierarchy and Context Clarity
2. Tag-Based Navigation and Deletion
3. Interactive Selection and Deletion
4. Search Capability
5. Multi/Single-Select Flexibility at Each Level
6. Maintains Selection Order
7. Theme Customization Options

- **Navigation Efficiency**: Searching and selecting options in traditional dependent dropdowns is difficult and time-consuming as the user needs to navigate through multiple dropdowns. Cascading Menu provides easy access to options through interactive selection or global search, making selection faster and more efficient.
- **Enhanced User Experience**: Understanding relationships between options in dependent dropdowns can be challenging. Cascading Menu provides a clear visual representation of the option hierarchy.

## Demo
![Untitled-video-Made-with-Clipchamp-_5_](https://github.com/user-attachments/assets/c4c9d8c3-02ef-43e3-9d15-ca40b8116fa1)


### Installation
```sh
npm install react-cascading-menu
```

### Example Usage

```jsx
import React, { useRef } from "react";
import ReactCascadingMenu from "react-cascading-menu";
import { menuGroup, preSelectedItems } from "./data.js";

const App = () => {
  const ref = useRef();

  const fetchSelectionItemsLabels = () => {
    console.log("get selections as label array", ref.current?.getAllItemsSelected());
  };

  const fetchSelectionItems = () => {
    console.log("get selections", ref.current?.getSelection());
  };

  return (
    <div>
      <ReactCascadingMenu
        ref={ref}
        menuGroup={menuGroup}
        selectedItems={preSelectedItems}
        isMultiSelection={true}
        displayValue="label"
        width="70%"
        height="400px"
        theme="light"
      />
    </div>
  );
};

export default App;
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
