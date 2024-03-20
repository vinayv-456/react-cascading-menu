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
  Item,
  FormatedSelections,
  emptyObj,
} from "./types";
import DropdownMenu from "./components/DropdownMenu";
import classNames from "classnames";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Index = forwardRef<Ref, Props>((props, ref) => {
  const {
    menuGroup,
    selectedItems: preSelectedItems = {},
    isObject = true,
    displayValue = "label",
    groupby = "label",
    caseSensitiveSearch = true,
    isMultiSelection = false,
    keepSearchTerm,
    emptyRecordMsg = "No Items",
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
  const [activeItem, setActiveItem] = useState<SelectedItemType>({});
  const parentGroupLookUp = useRef<parentGroupLookUp>({});
  const [error, setError] = useState("");
  const [results, setResults] = useState<string[][]>();

  useImperativeHandle(ref, () => ({
    test: () => {},
  }));

  useEffect(() => {
    // focus the search box whenever the click is inside the container
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (error) {
        console.log("Clearing the error");
        setError("");
      }
    }, 2000);

    // Cleanup function to clear the timeout when the component unmounts or when error changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

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

    if (!itemObj) {
      return {};
    }

    const connectedId: ItemId | undefined = isForward
      ? itemObj.childIds?.[0] // by default first child will be selected, if there are more than one children
      : itemObj.parentId;

    const currentLevelItem = {
      [groupName]: {
        [obj.id]: {
          ...itemObj,
          childIds: itemObj.childIds?.length ? [itemObj.childIds?.[0]] : [],
        },
      },
    };
    // getting prev/next item
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
      [groupHeading]: { [obj.id]: selectedItems?.[groupHeading]?.[obj?.id] },
      ...forwardPath,
    };
    return connectedPath;
  };

  const getFormatedSelectionsHelper = (
    groupName?: string,
    id?: ItemId
  ): FormatedSelections | {} => {
    // if the object is not present then return empty obj
    if (!groupName || !id || !selectedItems?.[groupName]?.[id]) {
      return {};
    }
    const obj: SelectedItemTypeVal = selectedItems?.[groupName]?.[id];
    const options =
      obj.childIds?.reduce((acc: SelectedItemType[], childId) => {
        return [...acc, getFormatedSelectionsHelper(obj.childGroup, childId)];
      }, []) || [];

    return {
      ...obj,
      options,
    };
  };

  const getFormatedSelections = () => {
    const mainGroupName = menuGroup.groupHeading;

    const formatedselections: (FormatedSelections | {})[] = menuGroup.options
      ? menuGroup.options?.reduce((acc: SelectedItemType[], opt) => {
          return [...acc, getFormatedSelectionsHelper(mainGroupName, opt.id)];
        }, [])
      : [];

    return formatedselections;
  };

  const printSelections = (
    obj: FormatedSelections,
    common: string,
    result: string[]
  ): void => {
    if (!obj) {
      return;
    }
    if (!obj.options || obj.options?.length === 0) {
      result.push(common ? common + "=>" + obj.label : obj.label);
      return;
    }

    common = common ? `${common} => ${obj.label}` : obj.label;
    obj.options.forEach((newObj) => {
      printSelections(newObj, common, result);
    });
  };

  // another approch
  // const printSelections = (obj: FormatedSelections) => {
  //   if (!obj) {
  //     return [];
  //   }
  //   if (!obj.options || obj.options?.length === 0) {
  //     return [obj.label];
  //   }
  //   const allChildRes: string[] = obj.options.reduce((acc: string[], ele) => {
  //     const childRes = printSelectionss(ele);
  //     return [...acc, ...childRes];
  //   }, []);

  //   return allChildRes.map((e) => `${obj.label}=>${e}`);
  // };

  useEffect(() => {
    const formatedSelections = getFormatedSelections();
    const res = formatedSelections.map((ele: FormatedSelections | {}) => {
      const result: string[] = [];
      if (ele && Object.keys(ele)?.length !== 0) {
        printSelections(ele as FormatedSelections, "", result);
        return result;
      }
      return result;
    });
    setResults(res);

    // another approch
    // const ress = formatedSelections.map((ele: FormatedSelections | {}) => {
    //   if (ele && Object.keys(ele)?.length !== 0) {
    //     return printSelectionss(ele as FormatedSelections);
    //   }
    //   return [];
    // });
    // console.log("ress", ress);

    console.log("formatedSelections", formatedSelections);
  }, [selectedItems]);

  const addItemSelection = (
    selectedItems: SelectedItemType,
    groupHeading: string,
    item: MenuGroup,
    parentId: ItemId,
    isMultiSelection: boolean
  ) => {
    console.log("adding item", isMultiSelection);
    let newSelectedItems = { ...selectedItems };
    console.log("starting with", newSelectedItems);
    try {
      const { options, groupHeading: childGroup, ...itemRest } = item;
      if (childGroup && !parentGroupLookUp.current?.[childGroup]) {
        // adding the group lookup
        parentGroupLookUp.current[childGroup] = groupHeading;
      }
      const parentGroup = parentGroupLookUp.current?.[groupHeading];
      const parentItem = newSelectedItems?.[parentGroup]?.[parentId];

      // cut the previous selections in the group if its not mulitselect
      // already has some values in the current group, so need to clear them
      if (
        !isMultiSelection &&
        parentItem?.childIds?.[0] &&
        newSelectedItems?.[groupHeading]?.[parentItem?.childIds[0]]
      ) {
        console.log("removing others as it is single selection");
        // "remove the prev selection in the group as it is single selection"
        newSelectedItems = cascadeSelectionRemovalWithProps(
          newSelectedItems,
          groupHeading,
          parentId,
          newSelectedItems?.[groupHeading]?.[parentItem?.childIds[0]],
          { isParentUpdateRequired: true, isMultiSelection }
        );
      }

      // check if the child is already present in the parent childIDS
      const isAlreadySelected = parentItem?.childIds?.some(
        (e) => e === item.id
      );
      console.log(
        "isAlreadySelected",
        isAlreadySelected,
        groupHeading,
        newSelectedItems?.[groupHeading]
      );

      if (!isAlreadySelected) {
        // item addition
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

        // adding its children to its parent
        if (newSelectedItems?.[parentGroup]?.[parentId]) {
          const prevChildIds = isMultiSelection
            ? newSelectedItems[parentGroup][parentId]?.childIds || []
            : [];
          console.log("prev", prevChildIds, "new addition", item.id);

          newSelectedItems = {
            ...newSelectedItems,
            [parentGroup]: {
              ...newSelectedItems?.[parentGroup],
              [parentId]: {
                ...newSelectedItems[parentGroup][parentId],
                childGroup: groupHeading,
                childIds: [...prevChildIds, item.id],
              },
            },
          };
          console.log("updating parent group", newSelectedItems);
        }
      }
    } catch (e) {
      setError("issue while adding item");
      console.log("issue while adding item", e, selectedItems, item);
    }
    console.log("returning with", newSelectedItems);

    return newSelectedItems;
  };

  /**
   * Cascading item removal(current+children)
   * Removes the current selection and its children selections
   */
  const cascadeSelectionRemoval = (
    cummSelections: SelectedItemType,
    groupHeading: string,
    item: MenuGroup
  ): SelectedItemType => {
    console.log("removing item");
    try {
      const { id } = item;
      const updatedSelections = { ...cummSelections };
      const { childGroup, childIds }: SelectedItemTypeVal =
        updatedSelections?.[groupHeading]?.[id] || {};
      console.log("cutting down ", groupHeading, id);
      delete updatedSelections?.[groupHeading]?.[id];
      if (childGroup && childIds) {
        childIds?.forEach((childId) => {
          cascadeSelectionRemoval(
            updatedSelections,
            childGroup,
            updatedSelections?.[childGroup]?.[childId]
          );
        });
      }
      return updatedSelections;
    } catch (e) {
      console.log("Issue while remove item", e);
      setError("Issue while remove item");
      return cummSelections;
    }
  };

  /**
   *
   * cascading item removal and highlights the next available selection
   */
  const cascadeSelectionRemovalWithProps = (
    cummSelections: SelectedItemType,
    groupHeading: string,
    parentId: ItemId,
    item: MenuGroup,
    additionalProps?: {
      isParentUpdateRequired?: boolean;
      getNextAvailableSelection?: boolean;
      isMultiSelection?: boolean;
    }
  ): SelectedItemType => {
    const {
      isParentUpdateRequired = false,
      getNextAvailableSelection = false,
      isMultiSelection = false,
    } = additionalProps || {};
    // taking the orginal complete selections
    try {
      // TODO: why don't use parentLookup
      // get the parent group
      const parentGroup =
        cummSelections?.[groupHeading]?.[item.id]?.parentGroup;
      const updatedSelections = cascadeSelectionRemoval(
        cummSelections, // TODO: check this before used selectedItems
        groupHeading,
        item
      );
      // if there are other elements in the same group then make it active
      // made this complex as i'm following the selection order
      if (parentGroup && isParentUpdateRequired) {
        // need to use selectedItems(cummulative selections) as there will be only child in activeItem
        const parentItem: SelectedItemTypeVal =
          selectedItems[parentGroup][parentId];
        // removing the child from the parent
        console.log("removing children", item.id, "from", parentItem);
        const updatedChildren = parentItem.childIds?.filter(
          (e) => e !== item.id
        );

        if (isParentUpdateRequired) {
          console.log("isMultiSelection", isMultiSelection, updatedChildren);

          updatedSelections[parentGroup][parentId].childIds = isMultiSelection
            ? updatedChildren
            : updatedChildren?.length
            ? [updatedChildren[0]]
            : [];
          // // need to be carefull as activeItem can have the capability to modify selectedItems object
          // parentItem.childIds = updatedChildren;
        }
        if (getNextAvailableSelection) {
          const childId = updatedChildren?.[0];
          const childGroup = parentItem.childGroup;
          if (childId && childGroup && selectedItems[childGroup][childId]) {
            const otherPath = getConnectedItems(
              selectedItems[childGroup][childId],
              childGroup
            );
            console.log("returning new path", otherPath);

            return otherPath;
          }
        }
      } else if (!parentGroup && getNextAvailableSelection) {
        /**
         * if there is any other item in the same group having no parent i.e, in the first level
         */
        const nextAvailableItemId = Object.values(
          selectedItems[groupHeading]
        )?.find((ele) => ele.id !== item.id)?.id;
        console.log("nextAvailableItemId", nextAvailableItemId);
        if (nextAvailableItemId) {
          const otherPath = getConnectedItems(
            selectedItems[groupHeading][nextAvailableItemId],
            groupHeading
          );
          console.log("returning new path", otherPath);

          return otherPath;
        }
      }
      return updatedSelections;
    } catch (e) {
      console.log(
        "error in highlighting the other selection in the same group",
        e
      );
      return cummSelections;
    }
  };

  const handleItemSelection = (
    item: MenuGroup,
    groupHeading: string,
    parentId: ItemId
  ) => {
    console.log("new selection", item, groupHeading, parentId);
    const activeSelection = isMultiSelection ? activeItem : selectedItems;
    if (activeSelection?.[groupHeading]?.[item.id]) {
      // deselection of selectedItems

      // deselection of activeItem
      const newActiveItem = cascadeSelectionRemovalWithProps(
        activeItem,
        groupHeading,
        parentId,
        activeItem[groupHeading][item.id],
        {
          // as it activeItem and going for next available selection no need to update the
          // prev active item as it is anyway going to leave it
          // TODO: update the conditions to use getNextAvailableSelection without requiring to update parent
          isParentUpdateRequired: true,
          getNextAvailableSelection: true,
          isMultiSelection: false,
        }
      );
      console.log("finalll newActiveItem", newActiveItem);
      setActiveItem(newActiveItem);

      const newSelectedItems = cascadeSelectionRemovalWithProps(
        selectedItems,
        groupHeading,
        parentId,
        selectedItems[groupHeading][item.id],
        {
          isParentUpdateRequired: true,
          getNextAvailableSelection: false,
          isMultiSelection,
        }
      );
      console.log("finallll", newSelectedItems);
      setSelectedItems(newSelectedItems);
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
        console.log("starting selected Items update", selectedItems);
        const newSelectedItems = addItemSelection(
          selectedItems,
          groupHeading,
          item,
          parentId,
          isMultiSelection
        );
        setSelectedItems(newSelectedItems);
      }
    }
  };
  console.log("active item", activeItem);
  console.log("selectedItems", selectedItems);
  console.log("res", results);

  return (
    <>
      <span>{error}</span>

      <div ref={dropdownWrapperRef}>
        {/* <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          autoComplete="off"
          ref={searchBoxRef}
        /> */}
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
            level={0}
            isMultiSelection={isMultiSelection}
          />
        </div>
      </div>
      {/* print selections */}
      {results?.map((res) => res.map((res2) => <li>{res2}</li>))}
    </>
  );
});

export default Index;
