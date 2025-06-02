import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import styled from "styled-components";
import { ItemId, MenuGroupMap } from "../types";
import Tags from "./Tags";

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownTrigger = styled.div`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  &:hover {
    border-color: ${(props) => props.theme.selected};
  }
`;

const TagsWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  display: flex;
  align-items: center;
  .tag-container {
    margin: 0;
    padding: 0;
    min-height: 0;
    max-height: 60px;
    flex-wrap: nowrap;
    overflow-x: auto;
    background: none;
  }
`;

const SearchWrapper = styled.div`
  flex: 2;
  min-width: 120px;
  margin-left: 8px;
  display: flex;
  align-items: center;
`;

const DropdownMenu = styled.div<{ isOpen: boolean; layout: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  margin-top: 4px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  min-height: ${(props) => (props.layout === "vertical" ? "600px" : "200px")};
`;

interface Props {
  leafNodes: ItemId[][];
  menuGroupMap: MenuGroupMap;
  handleTagRemoval: (selectionPath: ItemId[]) => void;
  handleSelectionPopulation: (selectionPath: ItemId[]) => void;
  layout?: "horizontal" | "vertical";
  children: ReactNode;
}

const CascadingDropdown: React.FC<Props> = ({
  leafNodes,
  menuGroupMap,
  handleTagRemoval,
  handleSelectionPopulation,
  layout = "horizontal",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Split children: first is search, rest is menu
  let searchChild: ReactNode = null;
  let menuChildren: ReactNode = null;
  if (Array.isArray(children)) {
    searchChild = children[0];
    menuChildren = children.slice(1);
  } else {
    searchChild = children;
    menuChildren = null;
  }

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownTrigger onClick={() => setIsOpen(!isOpen)}>
        <TagsWrapper>
          <Tags
            leafNodes={leafNodes}
            menuGroupMap={menuGroupMap}
            handleTagRemoval={handleTagRemoval}
            handleSelectionPopulation={handleSelectionPopulation}
          />
        </TagsWrapper>
        <SearchWrapper>{searchChild}</SearchWrapper>
        <span>▼</span>
      </DropdownTrigger>
      <DropdownMenu layout={layout} isOpen={isOpen}>
        {menuChildren}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default CascadingDropdown;
