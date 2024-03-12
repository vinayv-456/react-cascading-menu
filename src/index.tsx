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
  parentGroupLookUp,
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
    groupName: string,
    isForward = true
  ): SelectedItemType => {
    const groupKey = isForward ? "childGroup" : "parentGroup";
    if (!obj) {
      return {};
    }
    const itemObj = selectedItems?.[groupName]?.[obj?.id];

    const currentLevelItem = {
      [groupName]: {
        [obj.id]: itemObj,
      },
    };
    if (!itemObj) {
      return currentLevelItem;
    }
    // getting prev/next item
    const connectedId: ItemId | undefined = isForward
      ? itemObj.childIds?.[0] // by default first child will be selected, if there are more than one children
      : itemObj.parentId;
    const connectedGroup = itemObj[groupKey];
    if (!connectedId || !connectedGroup) {
      return currentLevelItem;
    }

    console.log("adding", groupName, obj.id);
    console.log(
      "next",
      connectedGroup,
      selectedItems[connectedGroup][connectedId]
    );

    return {
      ...currentLevelItem,
      ...getConnectedItemByDirection(
        selectedItems[connectedGroup][connectedId],
        connectedGroup,
        isForward
      ),
    };
  };

  const getConnectedItems = (
    obj: MenuGroup,
    groupHeading: string
  ): SelectedItemType => {
    const prevPath = getConnectedItemByDirection(obj, groupHeading, false);
    const forwardPath = getConnectedItemByDirection(obj, groupHeading);
    const connectedPath = {
      ...prevPath,
      [groupHeading]: { [obj.id]: obj },
      ...forwardPath,
    };
    console.log(
      "connectedPath",
      prevPath,
      { [groupHeading]: obj },
      forwardPath
    );

    return connectedPath;
  };

  const parentGroupLookUp = useRef<parentGroupLookUp>({});

  const addItemSelection = (
    selectedItems: SelectedItemType,
    groupHeading: string,
    item: MenuGroup,
    parentId: ItemId,
    isMultiSelection: boolean
  ) => {
    console.log("adding item");
    let newSelectedItems = selectedItems;
    try {
      const { options, groupHeading: childGroup, ...itemRest } = item;
      // console.log("parentGroup", parentGroup, parentId);
      parentGroupLookUp.current[childGroup] = groupHeading;
      // adding item details and its parent
      const parentGroup = parentGroupLookUp.current[groupHeading];
      console.log(
        "parentGroup",
        parentGroup,
        "groupHeading",
        groupHeading,
        "id",
        item.id
      );

      // cut the previous selections in the group if its not mulitselect
      // already has some values in the current group, so need to clear them
      if (!isMultiSelection && newSelectedItems?.[groupHeading]) {
        console.log(
          "found previous selections in the same group so clearing them up"
        );

        newSelectedItems = Object.values(
          newSelectedItems?.[groupHeading]
        ).reduce((acc, item) => {
          return cutMDownItems(acc, groupHeading, item);
        }, newSelectedItems);
        console.log("======clean up completed=========");
      }

      newSelectedItems = {
        ...newSelectedItems,
        [groupHeading]: {
          ...(isMultiSelection ? newSelectedItems?.[groupHeading] : null),
          [item.id]: {
            ...itemRest,
            groupHeading: groupHeading,
            parentId,
            parentGroup,
            childGroup,
          },
        },
      };
      console.log(
        "new---1",
        newSelectedItems,
        "check",
        isMultiSelection ? newSelectedItems?.[groupHeading] : null
      );

      // adding its children to its parent
      if (newSelectedItems?.[parentGroup]?.[parentId]) {
        newSelectedItems = {
          ...newSelectedItems,
          [parentGroup]: {
            ...newSelectedItems?.[parentGroup],
            [parentId]: {
              ...newSelectedItems[parentGroup][parentId],
              childGroup: groupHeading,
              childIds: [
                ...(newSelectedItems[parentGroup][parentId]?.childIds || []),
                item.id,
              ],
            },
          },
        };
      }
      console.log("new---2", newSelectedItems);
    } catch (e) {
      console.log("issue while adding item", e, selectedItems, item);
    }
    return newSelectedItems;
  };

  const cutMDownItems = (
    cummSelections: SelectedItemType,
    groupHeading: string,
    item: MenuGroup
  ): SelectedItemType => {
    console.log("removing item");
    try {
      console.log("selectedItems", cummSelections);
      const { groupHeading: childGroupVer, id } = item;
      const { childGroup, childIds }: SelectedItemTypeVal =
        cummSelections?.[groupHeading]?.[id] || {};
      console.log("childGroupVer", childGroupVer, childGroup);
      console.log("cutting down ", groupHeading, id);

      const updatedSelections = { ...cummSelections };
      delete updatedSelections?.[groupHeading]?.[id];
      console.log("selectedItems", updatedSelections);
      if (childGroup && childIds) {
        childIds?.forEach((childId) => {
          cutMDownItems(
            updatedSelections,
            childGroup,
            updatedSelections?.[childGroup]?.[childId]
          );
        });
      }
      return updatedSelections;
    } catch (e) {
      console.log("Issue while remove item", e);
      return cummSelections;
    }
  };

  const [activeItem, setActiveItem] = useState<SelectedItemType>({});
  const handleItemSelection = (
    item: MenuGroup,
    groupHeading: string,
    parentId: ItemId
  ) => {
    console.log("new selection", item, groupHeading, parentId);
    const activeSelection = isMultiSelection ? activeItem : selectedItems;
    if (activeSelection?.[groupHeading]?.[item.id]) {
      const newSelectedItems = cutMDownItems(
        selectedItems,
        groupHeading,
        selectedItems[groupHeading][item.id]
      );
      console.log("finallll", newSelectedItems);

      // setSelectedItems(selectedItems);

      const newActiveItem = cutMDownItems(
        activeItem,
        groupHeading,
        activeItem[groupHeading][item.id]
      );

      // console.log("finallll", newActiveItem);

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
          parentId,
          false
        );
        setActiveItem(newActiveItem);
      }

      // has 2 cases, new addition, might already have selected but it adding again doesn't make any difference
      const newSelectedItems = addItemSelection(
        selectedItems,
        groupHeading,
        item,
        parentId,
        isMultiSelection
      );
      setSelectedItems(newSelectedItems);
    }
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
