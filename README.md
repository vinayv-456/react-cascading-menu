# React Cascading Menu

[![npm version](https://badge.fury.io/js/react-cascading-menu.svg)](https://badge.fury.io/js/react-cascading-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, customizable **React cascading dropdown menu component** with multi-selection, search functionality, and hierarchical navigation. Perfect for building complex category selectors, dependent dropdowns, and nested menu systems.

**Cascading Menu** is a multi-selectable cascading menu component for React. It enhances user experience and navigation efficiency with the following features:

- **Navigation Efficiency**: Searching and selecting options in traditional dependent dropdowns is difficult and time-consuming as the user needs to navigate through multiple dropdowns. Cascading Menu provides easy access to options through interactive selection or global search, making selection faster and more efficient.
- **Enhanced User Experience**: Understanding relationships between options in dependent dropdowns can be challenging. Cascading Menu provides a clear visual representation of the option hierarchy.

## Key Benefits

- **Global Search**: Find options quickly across all levels
- **Multi-Selection**: Select multiple items at any level
- **Customizable Themes**: Light/dark themes with custom styling
- **Layout Flexibility**: Horizontal and vertical orientations

## Features

1. **Layout Mode/Orientation** - Switch between horizontal and vertical layouts
2. **Visual Hierarchy and Context Clarity** - Clear parent-child relationships
3. **Tag-Based Navigation and Deletion** - Easy selection management
4. **Interactive Selection and Deletion** - Click to select/deselect
5. **Search Capability** - Global search across all menu levels
6. **Multi/Single-Select Flexibility** - Configure selection mode per level
7. **Maintains Selection Order** - Preserves user selection sequence
8. **Theme Customization Options** - Light/dark themes with custom styling

## Use Cases

- **E-commerce Category Filters**: Product categorization (Electronics > Laptops > Gaming)
- **Location Selectors**: Country > State > City > Area selection
- **Organizational Hierarchies**: Department > Team > Role selection
- **Content Management**: Topic > Subtopic > Tag organization
- **Configuration Panels**: Settings with nested options

## Installation

```sh
npm install react-cascading-menu
```

## 🎬 Demo

![React Cascading Menu Demo](https://github.com/user-attachments/assets/159c9e0e-5474-4099-ba03-36272d9eab09)

[**🔗 Live Demo**](https://vinayv-456.github.io/react-cascading-menu/) | [**📖 Documentation**](https://github.com/vinayv-456/react-cascading-menu#readme)

## 🚀 Quick Start

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

![React Cascading Menu - Vertical Layout](https://github.com/user-attachments/assets/aa80d7ef-f008-4807-8ad4-87a5ccac2ad4)
![React Cascading Menu - Horizontal Layout](https://github.com/user-attachments/assets/894fbef2-f564-444f-b9ee-4620acc7febd)

## 🛠️ API Reference

### Props

| Prop               | Type                         | Default      | Description                 |
| ------------------ | ---------------------------- | ------------ | --------------------------- |
| `menuGroup`        | `MenuGroup`                  | required     | Hierarchical data structure |
| `isMultiSelection` | `boolean`                    | `true`       | Enable multi-selection      |
| `layout`           | `'horizontal' \| 'vertical'` | `'vertical'` | Menu orientation            |
| `theme`            | `'light' \| 'dark'`          | `'light'`    | Color theme                 |
| `width`            | `string`                     | `'100%'`     | Component width             |
| `height`           | `string`                     | `'300px'`    | Component height            |
| `displayValue`     | `string`                     | `'label'`    | Key to display from options |
| `selectedItems`    | `SelectedItem[]`             | `[]`         | Pre-selected items          |

### Methods

| Method                  | Returns          | Description                  |
| ----------------------- | ---------------- | ---------------------------- |
| `getSelection()`        | `SelectedItem[]` | Get all selected items       |
| `getAllItemsSelected()` | `string[]`       | Get selected labels as array |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/react-cascading-menu)
- [GitHub Repository](https://github.com/vinayv-456/react-cascading-menu)
- [Live Demo](https://vinayv-456.github.io/react-cascading-menu/)
- [Report Issues](https://github.com/vinayv-456/react-cascading-menu/issues)

## 🏷️ Keywords

`react` `dropdown` `cascading` `menu` `select` `multiselect` `search` `navigation` `ui-component` `typescript` `styled-components` `hierarchical` `tree-select` `category-selector` `dependent-dropdown`
