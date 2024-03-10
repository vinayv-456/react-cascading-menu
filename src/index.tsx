import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Props, Ref } from "./types";
import classes from "react-style-classes";
import DropdownMenu from "./components/DropdownMenu";

const Index = forwardRef<Ref, Props>((props, ref) => {
  const {
    options,
    selectedItems,
    isObject,
    displayValue,
    groupby,
    caseSensitiveSearch,
    isMultiSelection,
    keepSearchTerm,
    emptyRecordMsg,
    selectionLimit,
    targetClassNames,
    showCheckbox,
    closeIconType,
    disablePreSelectedValues,
  } = props;
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [searchVal, setSearchVal] = useState<string>("");
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    test: () => {},
  }));

  useEffect(() => {
    // focus the search box whenever the click is inside the container
  }, []);

  const handleDpMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={classes("container")}>
      <div
        onClick={handleDpMenu}
        className={classes("dropdown-wrapper")}
        ref={dropdownWrapperRef}
      >
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          autoComplete="off"
          ref={searchBoxRef}
        />
        {/* add icon here */}
      </div>
      {isOpen && (
        <DropdownMenu
          options={options}
          isObject={isObject}
          displayValue={displayValue}
          groupby={groupby}
          emptyRecordMsg={emptyRecordMsg}
        />
      )}
    </div>
  );
});

export default Index;

Index.defaultProps = {
  isObject: true,
  displayValue: "label",
  groupby: "label",
  caseSensitiveSearch: true,
  isMultiSelection: false,
  emptyRecordMsg: "No Items",
};
