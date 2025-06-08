import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import styled from "styled-components";
import { ItemId, MenuGroupMap, SelectedItemType } from "../types";
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
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  &:hover {
    border-color: ${(props) => props.theme.selected};
  }
`;

const TriggerContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const TagsWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex-wrap: wrap;
`;

const SearchTermInput = styled.input`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  outline: none;
  font-size: 1em;
  font-weight: 500;
  margin-left: 8px;
  min-width: 60px;
  max-width: 200px;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: none;
  flex: 1;
  ::placeholder {
    color: ${({ theme }) => theme.text2 || "#aaa"};
    opacity: 1;
  }
`;

const SuggestionsPanel = styled.div`
  background: ${({ theme }) => theme.background2 || "#232b3a"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  margin: 8px 8px 12px 8px;
  padding: 8px 0;
  max-height: 180px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 1em;
  &:hover {
    background: ${({ theme }) => theme.selected || "#2d3950"};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean; layout: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${(props) => props.theme.background2 || props.theme.background};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  margin-top: 4px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  min-height: ${(props) => (props.layout === "vertical" ? "600px" : "200px")};
`;

interface CompleteObj {
  label: string;
  indexes: number[];
}

interface SearchResObj {
  label: string;
  labelsPath: string[];
  indexesPath: number[];
}

interface Props {
  leafNodes: ItemId[][];
  menuGroupMap: MenuGroupMap;
  handleTagRemoval: (selectionPath: ItemId[]) => void;
  handleSelectionPopulation: (selectionPath: ItemId[]) => void;
  layout?: "horizontal" | "vertical";
  allItems: CompleteObj[];
  handleBulkAddition: (items: SelectedItemType, leafId: ItemId) => void;
  children: ReactNode;
  mainParentId: ItemId;
}

const CascadingDropdown: React.FC<Props> = ({
  leafNodes,
  menuGroupMap,
  handleTagRemoval,
  handleSelectionPopulation,
  layout = "horizontal",
  allItems,
  handleBulkAddition,
  children,
  mainParentId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Listen for keypresses when dropdown is open
  useEffect(() => {
    console.log("isOpen", isOpen);
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle typing if input is focused
      if (document.activeElement && document.activeElement.tagName === "INPUT")
        return;
      console.log("e.key", e.key);

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setSearchTerm((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setSearchTerm((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  // Suggestion logic from Search.tsx
  const getSuggestions = (searchVal: string): SearchResObj[] => {
    if (!searchVal) return [];
    const matchedResults: SearchResObj[] = [];
    const searchValue = searchVal.toLowerCase();
    let recentResults: number[][] = [];
    let currentResults: number[][] = [];
    allItems.forEach((res) => {
      const { label, indexes } = res;
      if (!label.toLowerCase().includes(searchValue)) {
        return;
      }
      const labelArr = label.split("=>");
      recentResults = currentResults.length ? currentResults : recentResults;
      currentResults = [];
      labelArr.forEach((e, index) => {
        const arg1 = labelArr
          .slice(0, index + 1)
          .join("=>")
          .toLowerCase();
        const arg2 = searchValue.toLowerCase();

        if (arg1.includes(arg2)) {
          const indexesPath = indexes.slice(0, index + 1);
          currentResults.push(indexesPath);
          const labelsPath = labelArr;
          // just need to check in the most recent results to remove the redundency
          const isPrevAdded = recentResults.some((e) => {
            return e.join("-").includes(indexesPath.join("-"));
          });
          if (isPrevAdded) {
            return;
          }
          matchedResults.push({
            label: e,
            labelsPath,
            indexesPath,
          });
        }
      });
    });
    return matchedResults;
  };

  // Format selection logic from Search.tsx
  const handleSuggestionClick = (searchItemSelection: SearchResObj) => {
    const { indexesPath } = searchItemSelection;
    // Use the root menu id as the initial parent id
    const rootMenuId = Object.keys(menuGroupMap)[0];
    let nextParentId: ItemId = rootMenuId;
    let formatedSelection: SelectedItemType = {};
    if (indexesPath.length > 0) {
      formatedSelection = indexesPath.reduce((acc, index) => {
        const parentId = nextParentId;
        nextParentId = menuGroupMap?.[parentId]?.childIds?.[index] || "";
        return {
          ...acc,
          [parentId]: {
            id: parentId,
            childIds: [nextParentId],
          },
        };
      }, {});
      formatedSelection[nextParentId] = {
        id: nextParentId,
        childIds: [],
      };
      handleBulkAddition(formatedSelection, nextParentId);
      setSearchTerm("");
      // close only if it is not a multi selection
      if (menuGroupMap[mainParentId]?.isMultiSelection === false) {
        setIsOpen(false);
      }
    }
  };

  // Split children: only menu is rendered in dropdown for now
  let menuChildren: ReactNode = null;
  if (Array.isArray(children)) {
    menuChildren = children[0];
  } else {
    menuChildren = children;
  }

  const suggestions = getSuggestions(searchTerm);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownTrigger onClick={() => setIsOpen(!isOpen)}>
        <TriggerContent>
          <TagsWrapper>
            <Tags
              leafNodes={leafNodes}
              menuGroupMap={menuGroupMap}
              handleTagRemoval={handleTagRemoval}
              handleSelectionPopulation={handleSelectionPopulation}
            />
            {isOpen && (
              <SearchTermInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </TagsWrapper>
        </TriggerContent>
        <span>▼</span>
      </DropdownTrigger>
      <DropdownMenu layout={layout} isOpen={isOpen}>
        {searchTerm && suggestions.length > 0 && (
          <SuggestionsPanel>
            {suggestions.map((item, idx) => (
              <SuggestionItem
                key={idx}
                onClick={() => handleSuggestionClick(item)}
              >
                {item.labelsPath
                  .slice(0, item.indexesPath.length)
                  .map((e, i) => {
                    const isLast = i === item.indexesPath.length - 1;
                    return (
                      <span
                        key={i}
                        style={{ fontWeight: isLast ? "bold" : "normal" }}
                      >
                        {e}
                        {isLast ? "" : " => "}
                      </span>
                    );
                  })}
              </SuggestionItem>
            ))}
          </SuggestionsPanel>
        )}
        {menuChildren}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default CascadingDropdown;
