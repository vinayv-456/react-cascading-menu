import React, { useEffect, useState } from "react";
import { CompleteObj, MenuGroup } from "../types";
import useDebounce from "../hooks/useDebounce";

interface Props {
  allItems: CompleteObj[];
}

function Search(props: Props) {
  const { allItems } = props;
  const [searchInp, setSearchInp] = useState("");

  const handleSearch = (searchVal: string) => {};
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
      Search
    </div>
  );
}

export default Search;
