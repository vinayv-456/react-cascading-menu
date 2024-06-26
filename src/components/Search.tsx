import React, { useEffect, useState } from "react";
import {
  CompleteObj,
  ItemId,
  MenuGroup,
  SelectedItemType,
  SelectedItemTypeVal,
} from "../types";
import Dropdown from "./Dropdown";
import { initParentSelectedItem } from "../utils";

interface Props {
  allItems: CompleteObj[];
  menuGroup: MenuGroup;
  handleBulkAddition: (selectedItems: SelectedItemType, leadId: ItemId) => void;
}

interface SearchResObj {
  label: string;
  labelsPath: string[];
  indexesPath: number[];
}

function Search(props: Props) {
  const { allItems, menuGroup, handleBulkAddition } = props;
  const [searchResults, setSearchResults] = useState<SearchResObj[]>([]);

  // format the selected item to SelectedItemType
  const formSelection = (searchItemSelection: SearchResObj) => {
    const { indexesPath } = searchItemSelection;
    let obj: MenuGroup;
    let nextObj: MenuGroup = menuGroup;
    let leafId: ItemId = -1;
    let res = indexesPath.reduce(
      (acc: SelectedItemType, index: number): SelectedItemType => {
        obj = nextObj;
        const parentId = obj.id;
        const { id, label, value, groupHeading, isMultiSelection } =
          obj.options?.[index] || {};
        if (!obj.options?.[index] || !id || !label || !value) return acc;
        nextObj = obj.options?.[index];
        if (acc[parentId]) {
          acc[parentId].childIds = [id];
        }
        leafId = id;
        return {
          ...acc,
          [id]: {
            id,
            label,
            value,
            parentGroup: acc?.[parentId]?.groupHeading || "",
            parentId,
            groupHeading: obj.groupHeading,
            childGroup: groupHeading,
            isMultiSelection,
          },
        };
      },
      {}
    );
    const topChildId = menuGroup.options?.[indexesPath[0]].id;
    // also, add the top most parent, which is not part of indexes
    res = {
      ...res,
      [menuGroup.id]: {
        ...initParentSelectedItem(menuGroup.id, menuGroup.groupHeading),
        childIds: topChildId ? [topChildId] : null,
      },
    };
    if (leafId !== -1) {
      handleBulkAddition(res, leafId);
    }
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
      handleItemClick={formSelection}
      renderItem={renderItem}
    />
  );
}

export default Search;
