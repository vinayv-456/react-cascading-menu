import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  MenuGroup,
  Props,
  Ref,
  SelectedItemType,
  ItemId,
  SelectedItemTypeVal,
} from "./types";
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

  const getConnectedItemByDirection = (
    obj: MenuGroup,
    isForward = true
  ): SelectedItemType => {
    const partialSelection: SelectedItemType = {};
    const idKey = isForward ? "childId" : "parentId";
    const groupKey = isForward ? "childGroup" : "parentGroup";
    try {
      const { groupHeading, id } = obj;
      let grpName: string | undefined = groupHeading;
      let itemId: ItemId | undefined = id;
      while (true) {
        const itemObj: SelectedItemTypeVal = selectedItems?.[grpName]?.[itemId];
        if (!itemObj) {
          break;
        }
        grpName = itemObj[groupKey];
        itemId = itemObj[idKey];
        if (!grpName || !itemId) {
          break;
        }
        partialSelection[grpName] = {
          [itemId]: itemObj,
        };
      }
    } catch (e) {
      console.log("Issue while connecting the items", e);
    }
    return partialSelection;
  };
  const getConnectedItems = (
    obj: MenuGroup,
    groupHeading: string
  ): SelectedItemType => {
    const prevPath = getConnectedItemByDirection(obj, false);
    const forwardPath = getConnectedItemByDirection(obj);
    const connectedPath = {
      ...prevPath,
      [groupHeading]: { [obj.id]: obj },
      ...forwardPath,
    };
    console.log("connectedPath", prevPath, { groupHeading: obj }, forwardPath);

    return connectedPath;
  };

  const addItemSelection = (
    selectedItems: SelectedItemType,
    groupHeading: string,
    item: MenuGroup,
    parentItemObj: MenuGroup,
    isMultiSelection: boolean
  ) => {
    console.log("adding item");
    let newSelectedItems = selectedItems;
    try {
      const { options, ...itemRest } = item;
      const { id: parentId, groupHeading: parentGroup } = parentItemObj;
      // console.log("parentGroup", parentGroup, parentId);

      newSelectedItems = {
        ...selectedItems,
        [groupHeading]: {
          ...(isMultiSelection ? selectedItems?.[groupHeading] : null),
          [item.id]: { ...itemRest, parentId, parentGroup },
        },
      };
      if (selectedItems?.[parentGroup]?.[parentId]) {
        newSelectedItems = {
          ...selectedItems,
          [parentGroup]: {
            ...selectedItems?.[parentGroup],
            [parentId]: {
              ...selectedItems[parentGroup][parentId],
              childGroup: groupHeading,
              childId: item.id,
            },
          },
        };
      }
    } catch (e) {
      console.log("issue while adding item", e, selectedItems, item);
    }
    return newSelectedItems;
  };
  const cutDownItems = (
    obj: SelectedItemType,
    groupHeading: string,
    id: ItemId
  ) => {
    console.log("removing item");
    try {
      let grpName: string | undefined = groupHeading;
      let itemId: ItemId | undefined = id;
      while (grpName && itemId) {
        console.log("removing", grpName, itemId);
        const {
          childId,
          childGroup,
        }: { childId?: ItemId; childGroup?: string } =
          obj?.[grpName]?.[itemId] || {};
        delete obj?.[grpName]?.[itemId];
        grpName = childGroup;
        itemId = childId;
      }
    } catch (e) {
      console.log("Issue while remove item", e, obj, id);
    }
    return obj;
  };
  const [activeItem, setActiveItem] = useState<SelectedItemType>({});
  const handleItemSelection = (
    item: MenuGroup,
    groupHeading: string,
    parentItemObj: MenuGroup
  ) => {
    console.log("new selection", item);
    const activeSelection = isMultiSelection ? activeItem : selectedItems;
    if (activeSelection?.[groupHeading]?.[item.id]) {
      // delete selectedItems[groupHeading][item.id];
      // return selectedItems;
      const newSelectedItems = cutDownItems(
        selectedItems,
        groupHeading,
        item.id
      );
      setSelectedItems(newSelectedItems);

      // set the active selection
      const newActiveItem = cutDownItems(activeItem, groupHeading, item.id);
      setActiveItem(newActiveItem);
    } else {
      // add item
      const isPreviouslySelected = Object.values(
        selectedItems?.[groupHeading] || {}
      )?.some((ele) => ele.id === item.id);
      if (isPreviouslySelected) {
        // activating already selected path
        const newActiveItem = getConnectedItems(item, groupHeading);
        setActiveItem(newActiveItem);
      } else {
        // extending the active path
        const newActiveItem = addItemSelection(
          activeItem,
          groupHeading,
          item,
          parentItemObj,
          false
        );
        setActiveItem(newActiveItem);
      }

      // has 2 cases, new addition, might already have selected but it adding again doesn't make any difference
      const newSelectedItems = addItemSelection(
        selectedItems,
        groupHeading,
        item,
        parentItemObj,
        isMultiSelection
      );
      setSelectedItems(newSelectedItems);
    }

    // console.log("isPreviouslySelected", isPreviouslySelected);
    // const newActiveItem = isPreviouslySelected
    //   ? cutDownItems(activeItem, groupHeading, item.id)
    //   : addItemSelection(activeItem, groupHeading, item, parentItemObj, false);
    // console.log("newActiveItem", newActiveItem);

    // // TODO: handled only single selection
    // if (selectedItems?.[groupHeading]?.[item.id]) {
    //   // deselect
    //   const { [groupHeading]: id, ...restSelected } = selectedItems;
    //   setSelectedItems(restSelected);
    // } else {
    //   // add item
    //   setSelectedItems({
    //     ...selectedItems,
    //     [groupHeading]: {
    //       ...selectedItems?.[groupHeading],
    //       [item.id]: { ...itemRest, parentItemObj },
    //     },
    //   });
    // }
  };
  console.log("active item", activeItem);

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
          activeItem={activeItem}
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
