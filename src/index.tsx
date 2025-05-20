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
  CompleteObj,
  MODES,
  MenuGroupMap,
  SelectedItemTypeV2,
  SelectedItemTypeValV2,
} from "./types";
import {
  addItemSelection,
  cascadeSelectionRemoval,
  cascadeSelectionRemovalWithProps,
  fromatPreSelections,
  getAllLeafNodes,
  getConnectedItemByDirection,
  getConnectedItems,
  getParentGroup,
  initParentSelectedItem,
  menuGroupTreeToMap,
} from "./utils";
import Tags from "./components/Tags";
import { theme } from "./theme";
import MenuGroupComp from "./components/MenuGroup";
import { MenuGroupContainer, MainContainer, ClearTagsBtn } from "./styles";
import Search from "./components/Search";
export interface CascadingMenuRef {
  getSelection: () => FormatedSelections[] | null;
  getAllItemsSelected: () => string[][];
  getSelectionsObjs: () => {
    selectedItems: SelectedItemTypeV2;
    activeItem: SelectedItemTypeV2;
  };
  leafNodes: ItemId[][];
}

const Index = forwardRef<CascadingMenuRef, Props>((props, ref) => {
  const {
    menuGroup,
    selectedItems: preSelectedItems = [],
    width = "100%",
    height = "360px",
    displayValue = "label",
    theme: themeMode = MODES.LIGHT,
    selectionColor = "#007BFF",
  } = props;
  const [menuGroupMap, setMenuGroupMap] = useState<MenuGroupMap>({});
  const [selectedItems, setSelectedItems] = useState<SelectedItemTypeV2>({});
  const [activeItem, setActiveItem] = useState<SelectedItemTypeV2>({});
  const parentGroupLookUp = useRef<parentGroupLookUp>({});
  const [error, setError] = useState("");
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const menuLevelDetails = useRef<{ shouldScroll: boolean }>({
    shouldScroll: false,
  });

  useEffect(() => {
    setMenuGroupMap(menuGroupTreeToMap(menuGroup));
  }, [menuGroup]);

  console.log("menuGroupMap", menuGroupMap);

  // console.log("testing-2");
  // console.log("activeItem", activeItem);
  // console.log("selectedItems", selectedItems);

  // useEffect(() => {
  //   if (Object.keys(preSelectedItems).length) {
  //     const { calcSelectedItems, calcActiveItems } = fromatPreSelections(
  //       menuGroup,
  //       preSelectedItems
  //     );
  //     setSelectedItems(calcSelectedItems);
  //     setActiveItem(calcActiveItems);
  //   }
  // }, [preSelectedItems]);

  useEffect(() => {
    /**
     * scroll left when there is new level opened
     * which is checed and activated during item click(handleItemSelection)
     */
    if (menuLevelDetails.current) {
      if (mainContainerRef.current && menuLevelDetails.current.shouldScroll) {
        mainContainerRef.current.scrollLeft += 1000;
        menuLevelDetails.current.shouldScroll = false;
      }
    }
  }, [activeItem]);

  const leafNodes = useMemo(() => {
    // used for tags
    return getLeafNodes(menuGroup.id);
  }, [selectedItems]);
  console.log("leafNodes", leafNodes);

  useImperativeHandle(ref, () => ({
    getSelection: () => {
      return getFormatedSelections();
    },
    getAllItemsSelected: () => {
      return getAllItems();
    },
    getSelectionsObjs: () => {
      return {
        selectedItems,
        activeItem,
      };
    },
    leafNodes,
  }));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (error) {
        setError("");
      }
    }, 2000);

    // Cleanup function to clear the timeout when the component unmounts or when error changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  const allItems = useMemo(() => {
    // caliculated only once, and sent to searchbar component
    return getAllLeafNodes(menuGroup, -1);
  }, [menuGroup]);

  /**
   * get the leaf nodes, also having the objects of its path
   */
  function getLeafNodes(id: ItemId): ItemId[][] {
    try {
      const parentId = menuGroup.id;
      const result: ItemId[][] = [];
      const getLeafNodeshelper = (
        parentId: ItemId,
        tempResult: ItemId[],
        result: ItemId[][]
      ) => {
        if (!selectedItems[parentId]?.childIds?.length) {
          result.push([menuGroup.id, ...tempResult]);
        }
        selectedItems[parentId]?.childIds?.forEach((childId) => {
          tempResult.push(childId);
          getLeafNodeshelper(childId, tempResult, result);
          tempResult.pop();
        });

        return result;
      };

      getLeafNodeshelper(parentId, [], result);
      return result;
    } catch (e) {
      console.log("error in getting the lead nodes", e);
    }
    return [];
  }

  // const getNextAvailableSelection = (
  //   id: ItemId,
  //   newSelectedItemsDetails?: {
  //     parentIdDef: ItemId | undefined;
  //     newSelectedItems: SelectedItemType;
  //   }
  // ): ItemId => {
  //   // when selectedItems is not updated yet!
  //   const { newSelectedItems, parentIdDef } = newSelectedItemsDetails || {};
  //   const selectedItemsUsed = newSelectedItems || selectedItems;
  //   // the obj of updated selectedItems of id might already have been cleared, so pass parentId
  //   const parentId = parentIdDef || selectedItemsUsed[id]?.parentId;

  //   if (parentId) {
  //     // get the next index
  //     const children = selectedItemsUsed[parentId].childIds || [];
  //     const length = children?.length - 1;
  //     const currentNodeIndex = children?.findIndex((itemId) => itemId === id);

  //     // usefull when the children might already been cleared
  //     // so the return parent, as just the children are removed
  //     if (length === -1) {
  //       return parentId;
  //     }
  //     if (length === 0 && currentNodeIndex === 0) {
  //       return getNextAvailableSelection(parentId);
  //     }

  //     return currentNodeIndex + 1 <= length
  //       ? children[currentNodeIndex + 1]
  //       : children[currentNodeIndex - 1];
  //   }
  //   return -1;
  // };

  const handleTagRemoval = (selectionPath: ItemId[]) => {
    try {
      const reversedSelectionPath = selectionPath.reverse();
      const newSelectedItems = { ...selectedItems };
      let newActiveItem = {};

      for (const id of reversedSelectionPath) {
        delete newSelectedItems[id];
        const index = reversedSelectionPath.indexOf(id);
        const parentId = selectionPath[index + 1];
        // stop if the parent has more than 1 child
        if (
          parentId &&
          newSelectedItems?.[parentId]?.childIds &&
          newSelectedItems[parentId]?.childIds?.length > 1
        ) {
          newSelectedItems[parentId].childIds = newSelectedItems?.[
            parentId
          ]?.childIds?.filter((childId) => childId !== id);
          const childIds = newSelectedItems[parentId]?.childIds;
          if (childIds && childIds.length > 0) {
            const newLeafNodeId = childIds[0];
            newActiveItem = getConnectedItems(
              menuGroupMap,
              newLeafNodeId,
              newSelectedItems,
              true
            );
          } else {
            setActiveItem({});
          }
          break;
        }
      }
      setActiveItem(newActiveItem);
      setSelectedItems(newSelectedItems);
    } catch (e) {
      console.log("error in tag removal", e);
    }
  };

  const handleSelectionPopulation = (selectionPath: ItemId[]) => {
    const newActiveItem = selectionPath.reduce(
      (acc: SelectedItemTypeV2, id: ItemId, index): SelectedItemTypeV2 => {
        return {
          ...acc,
          [id]: { id: id, childIds: [selectionPath[index + 1]] },
        };
      },
      {}
    );
    setActiveItem(newActiveItem);
  };

  const getFormatedSelections = () => {
    const getFromatedSelectionsHelper = (
      nodeId: ItemId
    ): FormatedSelections => {
      const childOption: FormatedSelections[] =
        (selectedItems[nodeId]?.childIds || [])?.map((childId) => {
          return getFromatedSelectionsHelper(childId);
        }) || [];

      const {
        id,
        label,
        value,
        groupHeading,
        groupHeading: childGroup,
        parentId,
      } = menuGroupMap[nodeId];
      let parentGroup;
      if (parentId) {
        const { groupHeading } = menuGroupMap[parentId];
        parentGroup = groupHeading;
      }
      return {
        id,
        label,
        value,
        groupHeading,
        parentGroup,
        parentId,
        childGroup,
        childIds: selectedItems[nodeId]?.childIds ?? undefined,
        options: childOption,
      };
    };
    return getFromatedSelectionsHelper(menuGroup.id).options;
  };

  const getAllItems = (): string[][] => {
    const getAllItemsHelper = (id: ItemId): string[] => {
      if (!menuGroupMap[id]) return [];
      const { childIds } = selectedItems[id];
      return [
        menuGroupMap[id].label,
        ...(childIds || []).flatMap(getAllItemsHelper),
      ];
    };
    const result = selectedItems[menuGroup.id]?.childIds?.map((e) =>
      getAllItemsHelper(e)
    );
    console.log("result", result);
    return result || [];
  };

  const handleItemSelection = (item: MenuGroup) => {
    // console.log("item", item.id, item.label);
    // clicking on the active item
    if (activeItem?.[item.id]) {
      // console.log("1");
      // deselection of selectedItems
      const { newSelectedItems, newChildId } = cascadeSelectionRemovalWithProps(
        menuGroupMap,
        selectedItems,
        item.id,
        {
          isParentUpdateRequired: true,
          getNextAvailableSelection: true,
          isMultiSelection: false,
        }
      );
      // console.log("1-newSelectedItems", newSelectedItems);
      setSelectedItems(newSelectedItems);

      if (newChildId) {
        // console.log("1-setting active item leaf", newChildId);
        setActiveItem(
          getConnectedItems(menuGroupMap, newChildId, newSelectedItems, true)
        );
      }
    } else {
      // add item
      const isPreviouslySelected = Object.values(selectedItems || {})?.some(
        (ele) => ele.id === item.id
      );
      if (isPreviouslySelected) {
        // console.log("2");
        // activating already selected path
        const newActiveItem = getConnectedItems(
          menuGroupMap,
          item.id,
          selectedItems,
          true
        );
        // console.log("newActiveItem", newActiveItem);
        setActiveItem(newActiveItem);
      } else {
        // console.log("3");
        // extending the active path
        const newSelectedItems = addItemSelection(
          menuGroupMap,
          selectedItems,
          item.id
        );
        setSelectedItems(newSelectedItems);
        // as this item is newly added, so it will be leaf
        setActiveItem(
          getConnectedItemByDirection(menuGroupMap, false, item.id, {})
        );
        // console.log("setting active item leaf", item.id);
        // console.log("newSelectedItems", newSelectedItems);

        if (menuLevelDetails.current) {
          menuLevelDetails.current.shouldScroll = true;
        }
      }
    }
  };

  const getNextAvailableSelection = (
    id: ItemId,
    selectedItems: SelectedItemTypeV2
  ) => {
    // check if there is a child in the same level
    let parentId = menuGroupMap[id].parentId;
    if (!parentId) return -1;
    let childIds = selectedItems[parentId]?.childIds || [];
    if (childIds.length > 1) {
      let index = childIds.findIndex((e) => e === id);
      return childIds[index === childIds.length - 1 ? 0 : index + 1];
    }

    // check previous level children and pick one of them
    while (parentId && childIds.length <= 1) {
      parentId = menuGroupMap[parentId]?.parentId;
      if (!parentId) return -1;
      childIds = selectedItems[parentId]?.childIds || [];
    }
    if (childIds.length > 0) {
      return childIds[0];
    }
    return -1;
  };

  const handleMultiChildren = (
    items: MenuGroup[] | [],
    parentId: ItemId,
    isSelection: boolean
  ) => {
    const formatedItems: SelectedItemTypeV2 = items.reduce((acc, e) => {
      return {
        ...acc,
        [e.id]: {
          id: e.id,
          childIds: [],
        },
      };
    }, {});

    const prevChildIds = { ...selectedItems }[parentId]?.childIds || [];
    const childIds = [
      ...prevChildIds,
      ...items.filter((e) => !(selectedItems[e.id] && true)).map((e) => e.id),
    ];
    let newSelectedItems = { ...selectedItems };

    // selectedItems updation
    // updating options to the parent
    if (isSelection) {
      // during selection
      newSelectedItems = {
        ...formatedItems,
        ...newSelectedItems,
      };
    } else {
      // during deselection
      for (const id of childIds || []) {
        if (newSelectedItems[id]) {
          newSelectedItems = cascadeSelectionRemoval(
            menuGroupMap,
            newSelectedItems,
            id
          );
        }
      }
    }

    // updating childsId to the parent
    newSelectedItems = {
      ...newSelectedItems,
      [parentId]: {
        ...selectedItems[parentId],
        childIds: isSelection ? childIds : [],
      },
    };

    const activeNodeId = childIds.find((e) => activeItem[e]) || childIds[0];
    let newActiveItem = {};
    if (isSelection) {
      // selection
      newActiveItem = getConnectedItems(
        menuGroupMap,
        activeNodeId,
        newSelectedItems,
        true
      );
      setActiveItem(newActiveItem);
    } else {
      // deselection
      setActiveItem(
        getConnectedItemByDirection(menuGroupMap, false, parentId, {})
      );
    }
    setSelectedItems(newSelectedItems);
  };

  const handleBulkAddition = (items: SelectedItemTypeV2, leafId: ItemId) => {
    // make the item as active
    setActiveItem(items);

    // insertion/updation in selectedItems
    if (selectedItems[leafId]) {
      return;
    }

    const newSelectedItems = { ...selectedItems };
    const deafultSelectionType = true; // TODO: default isMultiSelection

    // if the item is not present in the selections
    for (const [key, value] of Object.entries(items) as [
      ItemId,
      SelectedItemTypeValV2
    ][]) {
      const newChildId = value?.childIds?.[0];

      // childIds updation: has parent but no child so add childId to childIds list
      if (selectedItems[key] && newChildId && !selectedItems[newChildId]) {
        const selectionTypeDefined = menuGroupMap[key]?.isMultiSelection;
        const isMultiSelection =
          selectionTypeDefined === undefined
            ? deafultSelectionType
            : selectionTypeDefined;

        // remove prev childs if it is not mult selection
        if (!isMultiSelection) {
          newSelectedItems[key].childIds?.forEach((id) => {
            cascadeSelectionRemovalWithProps(
              menuGroupMap,
              newSelectedItems,
              id,
              {
                isParentUpdateRequired: true,
              }
            );
          });
        }

        newSelectedItems[key].childIds = isMultiSelection
          ? [...(newSelectedItems[key].childIds || []), newChildId]
          : [newChildId];
      } else if (key && !selectedItems[key]) {
        // direct addition as no id exist
        newSelectedItems[key] = value;
      }
    }

    console.log("newSelectedItems", newSelectedItems);

    setSelectedItems(newSelectedItems);
  };

  const handleClearAllTags = () => {
    // remove all the selection
    setSelectedItems({});
    setActiveItem({});
  };

  const themeDefined = { ...theme[themeMode], selected: selectionColor };
  // console.log("selected", selectedItems, activeItem);

  return (
    <ThemeProvider theme={themeDefined}>
      <span>{error}</span>
      <MainContainer width={width} height={height}>
        <Search
          parentId={menuGroup.id}
          allItems={allItems}
          menuGroupMap={menuGroupMap}
          handleBulkAddition={handleBulkAddition}
        />
        <MenuGroupContainer ref={mainContainerRef}>
          <MenuGroupComp
            menuGroup={menuGroup}
            displayValue={displayValue}
            showNext={true}
            activeItem={activeItem}
            selectedItems={selectedItems}
            handleItemSelection={handleItemSelection}
            level={0}
            handleMultipleChildrenSel={handleMultiChildren}
          />
        </MenuGroupContainer>
        {/* render the tag list */}
        <Tags
          leafNodes={leafNodes}
          handleTagRemoval={handleTagRemoval}
          handleSelectionPopulation={handleSelectionPopulation}
          menuGroupMap={menuGroupMap}
        />
        <ClearTagsBtn onClick={handleClearAllTags}>Clear All</ClearTagsBtn>
      </MainContainer>
    </ThemeProvider>
  );
});

export default Index;
export type { Props };
