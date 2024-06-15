import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useDebounce from "../hooks/useDebounce";
import useOnClickOutside from "../hooks/useClickoutside";

const DropdownContainer = styled.div`
  position: relative;
  width: 400px;
  z-index: 100;
  margin-bottom: 5px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DropdownListItem = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

interface DropdownProps<T> {
  items: T[];
  handleItemClick: (opt: T) => void;
  handleSearchChange: (val: string) => void;
  renderItem: (
    item: T,
    searchTerm: string
  ) => {
    label: string;
    key: number | string;
    renderComp: () => React.JSX.Element;
  };
}

const Dropdown = <T extends {}>({
  items,
  handleItemClick,
  handleSearchChange,
  renderItem,
}: DropdownProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const debouncedSearchVal = useDebounce<string>(searchTerm, 1000);
  useEffect(() => {
    handleSearchChange(debouncedSearchVal);
  }, [debouncedSearchVal]);

  const handleSearchItemClick = (item: T) => {
    setIsOpen(false);
    handleItemClick(item);
    setSearchTerm("");
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(dropdownRef, handleClickOutside);

  return (
    <DropdownContainer ref={dropdownRef}>
      <SearchInput
        type="text"
        placeholder="search for items"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <DropdownList>
          {searchTerm && !items.length && <span>No Results</span>}
          {items.map((item: T) => {
            const { key, label, renderComp } = renderItem(item, searchTerm);
            return (
              <DropdownListItem
                key={key}
                onClick={() => handleSearchItemClick(item)}
              >
                {renderComp ? renderComp() : label}
              </DropdownListItem>
            );
          })}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
