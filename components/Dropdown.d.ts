import React from "react";
interface DropdownProps<T> {
    items: T[];
    handleItemClick: (opt: T) => void;
    handleSearchChange: (val: string) => void;
    renderItem: (item: T, searchTerm: string) => {
        label: string;
        key: number | string;
        renderComp: () => React.JSX.Element;
    };
}
declare const Dropdown: <T extends {}>({ items, handleItemClick, handleSearchChange, renderItem, }: DropdownProps<T>) => React.JSX.Element;
export default Dropdown;
