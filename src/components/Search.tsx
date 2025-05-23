import React, { useEffect, useState } from "react";
import {
  CompleteObj,
  ItemId,
  MenuGroup,
  MenuGroupMap,
  SelectedItemType,
} from "../types";
import Dropdown from "./Dropdown";

interface Props {
  allItems: CompleteObj[];
  parentId: ItemId;
  menuGroupMap: MenuGroupMap;
  handleBulkAddition: (selectedItems: SelectedItemType, leadId: ItemId) => void;
}

interface SearchResObj {
  label: string;
  labelsPath: string[];
  indexesPath: number[];
}

function Search(props: Props) {
  const { allItems, menuGroupMap, parentId, handleBulkAddition } = props;
  const [searchResults, setSearchResults] = useState<SearchResObj[]>([]);

  // format the selected item to SelectedItemType
  const formatSelection = (searchItemSelection: SearchResObj) => {
    const { indexesPath } = searchItemSelection;
    let nextParentId = parentId;
    let formatedSelection: SelectedItemType = indexesPath.reduce(
      (acc, index) => {
        const parentId = nextParentId;
        nextParentId = menuGroupMap?.[parentId]?.childIds?.[index] || "";
        return {
          ...acc,
          [parentId]: {
            id: parentId,
            childIds: [nextParentId],
          },
        };
      },
      {}
    );
    formatedSelection[nextParentId] = {
      id: nextParentId,
      childIds: [],
    };
    handleBulkAddition(formatedSelection, nextParentId);
  };

  const handleSearch = (searchVal: string) => {
    if (!searchVal) {
      setSearchResults([]);
      return;
    }
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
          .toLowerCase(); // e.trim().toLowerCase();
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
    setSearchResults(matchedResults);
  };

  const renderItem = (item: SearchResObj, searchTerm: string) => {
    return {
      key: item.label,
      label: item.label,
      renderComp: () => {
        const { label, labelsPath, indexesPath } = item;
        const arr = labelsPath.slice(0, indexesPath.length);
        return (
          <div>
            {arr.map((e, index) => {
              const val = index !== arr.length - 1 ? `${e} =>` : e;
              if (
                e.toLowerCase().includes(searchTerm.toLowerCase()) ||
                searchTerm.toLowerCase().includes(e.toLowerCase())
              )
                return <span style={{ fontWeight: "bold" }}>{val}</span>;
              return <span>{val}</span>;
            })}
          </div>
        );
      },
    };
  };
  return (
    <Dropdown<SearchResObj>
      items={searchResults}
      handleSearchChange={handleSearch}
      handleItemClick={formatSelection}
      renderItem={renderItem}
    />
  );
}

export default Search;
