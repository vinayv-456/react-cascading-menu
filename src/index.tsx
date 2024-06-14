import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import {
  MenuGroup,
  Props,
  SelectedItemType,
  ItemId,
  SelectedItemTypeVal,
  parentGroupLookUp,
  Item,
  FormatedSelections,
  emptyObj,
  mvpSelectedProps,
} from "./types";
import classNames from "classnames";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getParentGroup, initParentSelectedItem } from "./utils";
import Tags from "./components/Tags";
import { theme } from "./theme";
import MenuGroupComp from "./components/MenuGroup";
import { DropdownMenu, MainContainer } from "./styles";
export interface CascadingMenuRef {
  getSelection: () => ({} | FormatedSelections)[];
  getAllItemsSelectedBySplit: () => string[][][];
  getAllItemsSelected: () => string[][];
}
const Index = forwardRef<CascadingMenuRef, Props>((props, ref) => {
  const {
    menuGroup,
    selectedItems: preSelectedItems = {},
    isObject = true,
    displayValue = "label",
    groupby = "label",
    caseSensitiveSearch = true,
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
  const [formatedSelections, setFormatedSelections] = useState<
    ({} | FormatedSelections)[]
  >([]);
  const parentGroupLookUp = useRef<parentGroupLookUp>({});
  const [error, setError] = useState("");

  useImperativeHandle(ref, () => ({
    getSelection: () => {
      return getFormatedSelections();
    },
    getAllItemsSelected: () => {
      return getAllItems(formatedSelections);
    },
    getAllItemsSelectedBySplit: () => {
      return getAllItemsBySplit(formatedSelections);
    },
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

  // print results using bottom-up approch
  // const printSelections2 = (obj: FormatedSelections) => {
  //   if (!obj) {
  //     return [];
  //   }
  //   if (!obj.options || obj.options?.length === 0) {
  //     return [obj.label];
  //   }
  //   const allChildRes: string[] = obj.options.reduce((acc: string[], ele) => {
  //     const childRes = printSelections2(ele);
  //     return [...acc, ...childRes];
  //   }, []);

  //   return allChildRes.map((e) => `${obj.label}=>${e}`);
  // };

  const getConnectedItemByDirection = (
    obj: MenuGroup,
    isForward = true
  ): SelectedItemType => {
    if (!obj) {
      return {};
    }
    const itemObj = selectedItems?.[obj?.id];

    if (!itemObj) {
      return {};
    }

    const connectedId: ItemId | undefined = isForward
      ? itemObj.childIds?.[0] // by default first child will be selected, if there are more than one children
      : itemObj.parentId;

    const currentLevelItem = {
      [obj.id]: {
        ...itemObj,
        childIds: itemObj.childIds?.length ? [itemObj.childIds?.[0]] : [],
      },
    };
    // getting prev/next item
    if (!connectedId) {
      return currentLevelItem;
    }

    console.log("adding", obj.id);
    console.log("next", selectedItems[connectedId]);

    return {
      ...currentLevelItem,
      ...getConnectedItemByDirection(selectedItems[connectedId], isForward),
    };
  };

  const getLeafNodes = (id: ItemId): mvpSelectedProps[][] => {
    try {
      const { label, id: nodeId, value } = selectedItems[id];
      if (!selectedItems[id].childIds?.length) {
        return [[{ label, id: nodeId, value }]];
      }

      // children paths
      const childrenRes =
        selectedItems[id].childIds?.reduce(
          (
            acc: mvpSelectedProps[][],
            childId: ItemId
          ): mvpSelectedProps[][] => {
            const { label, id: nodeId, value } = selectedItems[childId];
            return [...acc, ...getLeafNodes(nodeId)];
          },
          []
        ) || [];

      // add parent to all its children
      return childrenRes?.map((sol) => {
        return [{ label, id: nodeId, value }, ...sol];
      });
    } catch (e) {
      console.log("error in getting the lead nodes", e);
    }
    return [];
  };

  const leafNodes = useMemo(() => {
    console.log("recalulating leafs...");
    return getLeafNodes(menuGroup.id);
  }, [selectedItems]);

  const getNextAvailableSelection = (id: ItemId): ItemId => {
    const parentId = selectedItems[id].parentId;

    if (parentId) {
      // get the next index
      const children = selectedItems[parentId].childIds || [];
      const length = children?.length - 1;
      const currentNodeIndex = children?.findIndex((itemId) => itemId === id);
      // console.log(
      //   "currentNodeIndex",
      //   currentNodeIndex,
      //   length,
      //   children,
      //   parentId
      // );

      if (length === 0 && currentNodeIndex === 0) {
        return getNextAvailableSelection(parentId);
      }
      return currentNodeIndex + 1 <= length
        ? children[currentNodeIndex + 1]
        : children[currentNodeIndex - 1];
    }
    // TODO: control, cannot come here as parentId is madatory
    return -1;
  };

  const handleTagRemoval = (selectionPath: mvpSelectedProps[]) => {
    try {
      let newActiveItem = activeItem;
      const leafId = selectionPath[selectionPath.length - 1].id;
      const isCurrentActiveNodeRemoved = activeItem[leafId] && true;
      if (isCurrentActiveNodeRemoved) {
        const nextId = getNextAvailableSelection(leafId);
        if (nextId == -1) {
          // no next item available
          newActiveItem = {};
        } else {
          const obj = selectedItems[nextId];
          newActiveItem = getConnectedItems(obj);
        }
      }

      // check and change if active item is being removed
      const newSelectedItems = { ...selectedItems };
      const arr = selectionPath.slice().reverse();
      for (let i = 0; i < arr.length; i++) {
        // if the path has another child break, as node will be used for these children
        if ((newSelectedItems[arr[i].id].childIds || [])?.length >= 1) {
          break;
        } else {
          // remove the key from the childIds list in its parent's node
          const idTobeRemoved = arr[i].id;
          const parentIdOfremovedKey = newSelectedItems[idTobeRemoved].parentId;
          if (parentIdOfremovedKey) {
            const childIds =
              newSelectedItems[parentIdOfremovedKey].childIds || [];
            newSelectedItems[parentIdOfremovedKey].childIds = childIds.filter(
              (id) => id !== idTobeRemoved
            );
          }
          // delete the key
          delete newSelectedItems[arr[i].id];
        }
      }
      setSelectedItems(newSelectedItems);
      setActiveItem(newActiveItem);
    } catch (e) {
      console.log("error in tag removal", e);
    }
  };

  const handleSelectionPopulation = (selectionPath: mvpSelectedProps[]) => {
    const newActiveItem = selectionPath.reduce(
      (acc: SelectedItemType, item: mvpSelectedProps): SelectedItemType => {
        const { label, id } = item;
        return { ...acc, [id]: selectedItems[id] };
      },
      {}
    );
    setActiveItem(newActiveItem);
  };

  const getConnectedItems = (obj: MenuGroup): SelectedItemType => {
    const prevPath = getConnectedItemByDirection(obj, false);
    const forwardPath = getConnectedItemByDirection(obj);
    const connectedPath = {
      ...prevPath,
      [obj.id]: selectedItems?.[obj?.id],
      ...forwardPath,
    };
    return connectedPath;
  };

  const getFormatedSelectionsHelper = (
    groupName?: string,
    id?: ItemId
  ): FormatedSelections | {} => {
    // if the object is not present then return empty obj
    if (!groupName || !id || !selectedItems?.[id]) {
      return {};
    }
    const obj: SelectedItemTypeVal = selectedItems?.[id];
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

  const getAllItemsHelper = (obj: FormatedSelections): string[] => {
    if (!obj.options?.length) return [obj.label];
    else {
      const childItems = obj.options.reduce((acc: string[], e) => {
        return [...acc, ...getAllItemsHelper(e)];
      }, []);
      return [obj.label, ...childItems];
    }
  };

  const getAllItems = (
    formatedSelections: (FormatedSelections | {})[]
  ): string[][] => {
    if (!formatedSelections?.length) {
      return [];
    }
    return formatedSelections.map((ele: FormatedSelections | {}) => {
      if (!Object.keys(ele).length) {
        return [];
      }
      let result: string[] = [];
      if (ele && Object.keys(ele)?.length !== 0) {
        result = getAllItemsHelper(ele as FormatedSelections);
      }
      return result;
    });
  };

  const getAllItemsHelperBySplit = (ele: FormatedSelections): string[][] => {
    if (ele.splitAt === true) {
      // single level spread into a single container
      const childrenRes = ele.options?.reduce(
        (acc: string[][], child) => [
          ...acc,
          ...getAllItemsHelperBySplit(child),
        ],
        []
      );
      // append parent to all the childs
      return childrenRes?.map((e) => [ele.label, ...e]) || [[ele.label]];
    } else {
      // 2 level spread if length=0
      const likeTerms: string[] =
        ele.options?.reduce((acc: string[], child) => {
          const childResult = getAllItemsHelperBySplit(child);
          if (childResult.length === 1) {
            return [...acc, ...childResult[0]];
          }
          return acc;
        }, []) || [];

      const unlikeTerms: string[][] =
        ele.options?.reduce((acc: string[][], child) => {
          const childResult = getAllItemsHelperBySplit(child);
          if (childResult.length > 1) {
            return [...acc, ...childResult];
          }
          return acc;
        }, []) || [];

      // append parent to all the childs
      return (
        [...unlikeTerms, likeTerms]?.map((e) => [ele.label, ...e]) || [
          [ele.label],
        ]
      );
    }
  };

  const getAllItemsBySplit = (
    formatedSelections: (FormatedSelections | {})[]
  ): string[][][] => {
    if (!formatedSelections?.length) {
      return [[[]]];
    }
    return formatedSelections.map((ele: FormatedSelections | {}) => {
      if (!Object.keys(ele).length) {
        return [];
      }
      let result: string[][] = [];
      if (ele && Object.keys(ele)?.length !== 0) {
        result = getAllItemsHelperBySplit(ele as FormatedSelections);
      }
      return result;
    });
  };

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
      const parentItem = newSelectedItems?.[parentId];

      // cut the previous selections in the group if its not mulitselect
      // already has some values in the current group, so need to clear them
      if (
        !isMultiSelection &&
        parentItem?.childIds?.[0] &&
        newSelectedItems?.[parentItem?.childIds[0]]
      ) {
        console.log("removing others as it is single selection");
        // "remove the prev selection in the group as it is single selection"
        newSelectedItems = cascadeSelectionRemovalWithProps(
          newSelectedItems,
          groupHeading,
          parentId,
          newSelectedItems?.[parentItem?.childIds[0]],
          { isParentUpdateRequired: true, isMultiSelection }
        );
      }

      // removal of the current id from childIDs in its parent...
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
          [item.id]: {
            ...itemRest,
            groupHeading: groupHeading,
            parentId,
            parentGroup,
            childGroup,
          },
        };
        // init the parent item for the first group elements
        if (!parentItem) {
          newSelectedItems = {
            ...newSelectedItems,
            [parentId]: initParentSelectedItem(parentId, groupHeading),
          };
        }

        // adding its children to its parent
        if (newSelectedItems?.[parentId]) {
          const prevChildIds = isMultiSelection
            ? newSelectedItems[parentId]?.childIds || []
            : [];
          console.log("prev", prevChildIds, "new addition", item.id);
          newSelectedItems = {
            ...newSelectedItems,
            [parentId]: {
              ...newSelectedItems[parentId],
              childGroup: groupHeading,
              childIds: [...prevChildIds, item.id],
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
      const updatedSelections = cummSelections;
      const { childGroup, childIds }: SelectedItemTypeVal =
        updatedSelections?.[id] || {};
      delete updatedSelections?.[id];
      if (childGroup && childIds) {
        console.log("cutting down ", groupHeading, id, childIds, childGroup);
        childIds?.forEach((childId) => {
          cascadeSelectionRemoval(
            updatedSelections,
            childGroup,
            updatedSelections?.[childId]
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
      const updatedSelections = cascadeSelectionRemoval(
        { ...cummSelections }, // TODO: check this before used selectedItems
        groupHeading,
        item
      );
      // if there are other elements in the same group then make it active
      // made this complex as i'm following the selection order
      if (isParentUpdateRequired) {
        // need to use selectedItems(cummulative selections) as there will be only child in activeItem
        const parentItem: SelectedItemTypeVal = selectedItems[parentId];
        // removing the child from the parent
        console.log("removing children", item.id, "from", parentItem);
        const updatedChildren = parentItem.childIds?.filter(
          (e) => e !== item.id
        );

        updatedSelections[parentId].childIds = isMultiSelection
          ? updatedChildren
          : updatedChildren?.length
          ? [updatedChildren[0]]
          : [];
        // // need to be carefull as activeItem can have the capability to modify selectedItems object
        // parentItem.childIds = updatedChildren;

        if (getNextAvailableSelection) {
          // TODO: update fetching the next available selection
          const childId = updatedChildren?.[0];
          const childGroup = parentItem.childGroup;
          if (childId && childGroup && selectedItems[childId]) {
            const otherPath = getConnectedItems(selectedItems[childId]);
            console.log("returning new path", otherPath);

            return otherPath;
          }
        }
      } else if (getNextAvailableSelection) {
        /**
         * if there is any other item in the same group having no parent i.e, in the first level
         */
        // TODO: can't use selectedItems as, we should will the group of deleted ids not just item.id
        // const nextAvailableItemId = Object.values(selectedItems)?.find(
        //   (ele) => ele.id !== item.id
        // )?.id;
        // console.log("nextAvailableItemId", nextAvailableItemId);
        // if (nextAvailableItemId) {
        //   const otherPath = getConnectedItems(
        //     selectedItems[nextAvailableItemId],
        //   );
        //   console.log("returning new path", otherPath);
        //   return otherPath;
        // }
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
    parentId: ItemId,
    isMultiSelection: boolean
  ) => {
    console.log("new selection", item, groupHeading, parentId);
    const activeSelection = isMultiSelection ? activeItem : selectedItems;
    if (activeSelection?.[item.id]) {
      // deselection of activeItem
      const newActiveItem = cascadeSelectionRemovalWithProps(
        activeItem,
        groupHeading,
        parentId,
        activeItem[item.id],
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

      // deselection of selectedItems
      const newSelectedItems = cascadeSelectionRemovalWithProps(
        selectedItems,
        groupHeading,
        parentId,
        selectedItems[item.id],
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
      const isPreviouslySelected = Object.values(selectedItems || {})?.some(
        (ele) => ele.id === item.id
      );
      if (isPreviouslySelected) {
        // activating already selected path
        const newActiveItem = getConnectedItems(item);
        setActiveItem(newActiveItem);
      } else {
        // extending the active path
        const pId = parentId;
        const newActiveItem = addItemSelection(
          activeItem,
          groupHeading,
          item,
          pId,
          false
        );
        setActiveItem(newActiveItem);
        console.log("starting selected Items update", selectedItems);
        const newSelectedItems = addItemSelection(
          selectedItems,
          groupHeading,
          item,
          pId,
          isMultiSelection
        );
        setSelectedItems(newSelectedItems);
      }
    }
  };

  const handleGroupSelection = (parentId: ItemId) => {
    // setting splitAt in selectedItems
    const newSelectedItems = {
      ...selectedItems,
    };
    newSelectedItems[parentId].splitAt = true;
    setSelectedItems(newSelectedItems);

    // setting splitAt property at activeItem
    const newActiveItem = {
      ...activeItem,
    };
    newActiveItem[parentId].splitAt = true;
    setActiveItem(newActiveItem);
  };

  console.log("active item", activeItem);
  console.log("selectedItems", selectedItems);

  return (
    <ThemeProvider theme={theme.minimalistic}>
      <span>{error}</span>
      <MainContainer ref={dropdownWrapperRef}>
        {/* <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          autoComplete="off"
          ref={searchBoxRef}
        /> */}
        <div className="tag-container">
          {/* render the tag list */}
          <Tags
            leafNodes={leafNodes}
            handleTagRemoval={handleTagRemoval}
            handleSelectionPopulation={handleSelectionPopulation}
          />
        </div>
        <DropdownMenu>
          <MenuGroupComp
            menuGroup={menuGroup}
            isObject={isObject}
            displayValue={displayValue}
            groupby={groupby}
            emptyRecordMsg={emptyRecordMsg}
            showNext={true}
            activeItem={activeItem}
            selectedItems={selectedItems}
            handleItemSelection={handleItemSelection}
            handleGroupSelection={handleGroupSelection}
            level={0}
          />
        </DropdownMenu>
      </MainContainer>
    </ThemeProvider>
  );
});

export default Index;
