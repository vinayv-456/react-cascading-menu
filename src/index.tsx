import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MenuGroup, Props, Ref, SelectedItemType } from "./types";
import classes from "react-style-classes";
import DropdownMenu from "./components/DropdownMenu";
import classNames from "classnames";

const Index = forwardRef<Ref, Props>((props, ref) => {
  const {
    menuGroup,
    selectedItems: preSelectedItems,
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
  const [selectedItems, setSelectedItems] =
    useState<SelectedItemType>(preSelectedItems);

  useImperativeHandle(ref, () => ({
    test: () => {},
  }));

  useEffect(() => {
    // focus the search box whenever the click is inside the container
  }, []);

  const handleItemSelection = (
    item: MenuGroup,
    groupHeading: string,
    parentItemObj: MenuGroup
  ) => {
    const { options, ...itemRest } = item;
    console.log("new selection", item);
    // TODO: handled only single selection
    if (selectedItems?.[groupHeading]?.[item.id]) {
      // deselect
      const { [groupHeading]: id, ...restSelected } = selectedItems;
      setSelectedItems(restSelected);
    } else {
      // add item
      setSelectedItems({
        ...selectedItems,
        [groupHeading]: {
          [item.id]: { ...itemRest, parentItemObj },
        },
      });
    }
  };
  console.log("selectedItems", selectedItems);
  return (
    <div ref={dropdownWrapperRef}>
      <input
        type="text"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        autoComplete="off"
        ref={searchBoxRef}
      />
      <div
        className={classNames({
          "dropdown-menu": true,
        })}
      >
        <DropdownMenu
          menuGroup={menuGroup}
          isObject={isObject}
          displayValue={displayValue}
          groupby={groupby}
          emptyRecordMsg={emptyRecordMsg}
          showNext={true}
          selectedItems={selectedItems}
          handleItemSelection={handleItemSelection}
        />
      </div>
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
  selectedItems: {},
};
