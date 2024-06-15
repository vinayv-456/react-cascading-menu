import React, { useEffect, useState } from "react";
import {
  CompleteObj,
  MenuGroup,
  SelectedItemType,
  SelectedItemTypeVal,
} from "../types";
import useDebounce from "../hooks/useDebounce";
import { SearchItem } from "../styles";

interface Props {
  allItems: CompleteObj[];
  menuGroup: MenuGroup;
}

interface SearchResObj {
  label: string;
  labelsPath: string[];
  indexesPath: number[];
}

function Search(props: Props) {
  const { allItems, menuGroup } = props;
  const [searchInp, setSearchInp] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResObj[]>([]);
  const formSelection = (searchItemSelection: SearchResObj) => {
    const { label, labelsPath, indexesPath } = searchItemSelection;
    let obj: MenuGroup;
    let nextObj: MenuGroup = menuGroup;
    const res = indexesPath.reduce(
      (acc: SelectedItemType, index: number): SelectedItemType => {
        obj = nextObj;
        const parentId = obj.id;
        const { id, label, value, groupHeading } = obj.options?.[index] || {};
        if (!obj.options?.[index] || !id || !label || !value) return acc;
        nextObj = obj.options?.[index];
        if (acc[parentId]) {
          acc[parentId].childIds = [id];
        }
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
          },
        };
      },
      {}
    );
    console.log("selected", res);
    // TODO: set the result to active item and selected items
  };

  const handleSearch = (searchVal: string) => {
    if (!searchVal) {
      setSearchResults([]);
      return;
    }
    const matchedResults: SearchResObj[] = [];
    const searchValue = searchVal.toLowerCase();
    const higherLevResults = allItems.filter((e) =>
      e.label.toLowerCase().includes(searchValue)
    );
    let recentResults: number[][] = [];
    let currentResults: number[][] = [];
    // TODO: need to check the results again
    higherLevResults.forEach((res) => {
      const { label, indexes } = res;
      const labelArr = label.split("=>");
      recentResults = currentResults.length ? currentResults : recentResults;
      currentResults = [];
      labelArr.forEach((e, index) => {
        const arg1 = e.trim().toLowerCase();
        const arg2 = searchValue;
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
  const debouncedSearchVal = useDebounce<string>(searchInp, 1000);

  useEffect(() => {
    handleSearch(debouncedSearchVal);
  }, [debouncedSearchVal]);

  return (
    <div>
      <input
        type="text"
        value={searchInp}
        onChange={(e) => setSearchInp(e.target.value)}
      />
      {searchResults.map((e) => {
        const { label, labelsPath, indexesPath } = e;
        return (
          <SearchItem onClick={() => formSelection(e)}>
            <div>{label}</div>
            <div>{labelsPath.slice(0, indexesPath.length).join(" => ")}</div>
          </SearchItem>
        );
      })}
    </div>
  );
}

export default Search;
