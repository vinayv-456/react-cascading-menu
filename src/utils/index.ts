import { useEffect } from "react";
import {
  CompleteObj,
  FormatedSelections,
  Item,
  ItemId,
  MenuGroup,
  MenuGroupMap,
  SelectedItemType,
  SelectedItemTypeV2,
  SelectedItemTypeVal,
  SelectedItemTypeValV2,
} from "../types";

/**
 * convert menuGroup tree to map
 * for each node access without need to store the node details redundantly
 * and simplify the management complexity
 *
 * downward propogation through childIds
 * upward propogation through parentId
 */
export const menuGroupTreeToMap = (menuGroup: MenuGroup) => {
  const menuGroupTreeToMapHelper = (
    node: MenuGroup,
    parentId: ItemId,
    map: MenuGroupMap
  ) => {
    if (!node) return;
    map[node.id] = {
      id: node.id,
      label: node.label,
      value: node.value,
      groupHeading: node.groupHeading,
      childIds: node.options?.map((e) => e.id),
      parentId: parentId,
    };
    node.options?.forEach((e) => {
      menuGroupTreeToMapHelper(e, node.id, map);
    });
  };
  const mapObj: MenuGroupMap = {};
  menuGroupTreeToMapHelper(menuGroup, "", mapObj);
  return mapObj;
};

export const getConnectedItemByDirection = (
  obj: MenuGroupMap,
  isForward = true,
  nodeId: ItemId,
  selectedItems: SelectedItemTypeV2,
  isSingleSelection: boolean = false // valid only for forward propogation
): SelectedItemTypeV2 => {
  const connectedResult: SelectedItemTypeV2 = isSingleSelection
    ? {}
    : { ...selectedItems };
  console.log(isForward ? "forward" : "backward");

  const getConnectedItemByDirectionHelper = (
    obj: MenuGroupMap,
    isForward = true,
    nodeId: ItemId,
    selectedItems: SelectedItemTypeV2,
    connectedResult: SelectedItemTypeV2
  ) => {
    try {
      if (!nodeId) return connectedResult;

      // forward propogation using childIds of selections
      if (isForward) {
        let childIds = selectedItems[nodeId].childIds;
        if (isSingleSelection) {
          // pick the first child of all the children if single selection
          const firstChild = selectedItems[nodeId].childIds?.[0];
          childIds = firstChild ? [firstChild] : [];
        }
        console.log("picking", childIds, "for", nodeId);
        connectedResult[nodeId] = {
          ...selectedItems[nodeId],
          childIds,
        };
        if (childIds) {
          childIds.forEach((childId) => {
            getConnectedItemByDirectionHelper(
              obj,
              isForward,
              childId,
              selectedItems,
              connectedResult
            );
          });
        }
        return connectedResult;
      }

      // backward propofation using parentId of selections
      const parentId = obj[nodeId].parentId;
      // add the nodeId to the connectedResult if not present.
      if (!connectedResult[nodeId]) {
        console.log("adding", nodeId, "to connectedResult");
        connectedResult[nodeId] = {
          id: nodeId,
          childIds: [...(selectedItems[nodeId]?.childIds || [])],
        };
      }

      // console.log("parentId", parentId);
      // if the child is not present in the selectedItems, then add it to the list
      if (parentId && !selectedItems[nodeId]) {
        connectedResult[parentId] = {
          id: parentId,
          childIds: isSingleSelection
            ? [nodeId]
            : [...(selectedItems[parentId]?.childIds || []), nodeId],
        };
      }
      // console.log("connectedResult", connectedResult);

      if (parentId) {
        getConnectedItemByDirectionHelper(
          obj,
          isForward,
          parentId,
          selectedItems,
          connectedResult
        );
      }
      return connectedResult;
    } catch (e) {
      console.log("issue while getting connected item", e);
      return connectedResult;
    }
  };

  getConnectedItemByDirectionHelper(
    obj,
    isForward,
    nodeId,
    selectedItems,
    connectedResult
  );
  return connectedResult;
};

export const getConnectedItems = (
  obj: MenuGroupMap,
  nodeId: ItemId,
  selectedItems: SelectedItemTypeV2,
  isSingleSelection: boolean = false
): SelectedItemTypeV2 => {
  const selectedItemsUsed = selectedItems;
  const prevPath = getConnectedItemByDirection(
    obj,
    false,
    nodeId,
    selectedItemsUsed,
    isSingleSelection
  );
  const forwardPath = getConnectedItemByDirection(
    obj,
    true,
    nodeId,
    selectedItemsUsed,
    isSingleSelection
  );

  return {
    ...prevPath,
    ...forwardPath,
  };
};

export const addItemSelection = (
  menuGroupMap: MenuGroupMap,
  selectedItems: SelectedItemTypeV2,
  itemId: ItemId
): SelectedItemTypeV2 => {
  let newSelectedItems = { ...selectedItems };
  try {
    const parentId = menuGroupMap[itemId].parentId || "";
    const parentItem = menuGroupMap[parentId];
    let isMultiSelection = true;
    if (parentId && menuGroupMap[parentId].isMultiSelection !== undefined) {
      isMultiSelection = menuGroupMap[parentId].isMultiSelection ?? true; // Provide default value
    }
    // cut the previous selections in the group if its not mulitselect
    // already has some values in the current group, so need to clear them
    if (
      !isMultiSelection &&
      parentItem?.childIds?.[0] &&
      newSelectedItems?.[parentItem?.childIds[0]]
    ) {
      // "remove the prev selection in the group as it is single selection"
      const { newSelectedItems: newSelections } =
        cascadeSelectionRemovalWithProps(
          menuGroupMap,
          newSelectedItems,
          parentItem?.childIds?.[0],
          { isParentUpdateRequired: true, isMultiSelection }
        );
      newSelectedItems = newSelections;
    }

    // item addition, works even if direct parent is not selected
    newSelectedItems = getConnectedItemByDirection(
      menuGroupMap,
      false,
      itemId,
      newSelectedItems,
      !isMultiSelection
    );
  } catch (e) {
    // setError("issue while adding item");
    console.log("issue while adding item", e, selectedItems, itemId);
  } finally {
    return newSelectedItems;
  }
};

/**
 *
 * cascading item removal and highlights the next available selection
 */
export const cascadeSelectionRemovalWithProps = (
  menuGroupMap: MenuGroupMap,
  selectedItems: SelectedItemTypeV2,
  itemId: ItemId,
  additionalProps?: {
    isParentUpdateRequired?: boolean;
    getNextAvailableSelection?: boolean;
    isMultiSelection?: boolean;
  }
): {
  newSelectedItems: SelectedItemTypeV2;
  newChildId?: ItemId;
} => {
  const {
    isParentUpdateRequired = false,
    getNextAvailableSelection = false,
    isMultiSelection = false, // TODO: is there dependency on this?
  } = additionalProps || {};
  // taking the orginal complete selections
  try {
    // cascading item removal
    const updatedSelections = cascadeSelectionRemoval(
      menuGroupMap,
      selectedItems,
      itemId
    );
    // console.log("updatedSelections", updatedSelections);

    // apply the passed props

    // if there are other elements in the same group then make it active
    if (isParentUpdateRequired) {
      // update the parent's childIds
      let parentId = menuGroupMap[itemId].parentId;
      if (parentId && selectedItems?.[parentId]) {
        const updatedChildren =
          selectedItems[parentId].childIds?.filter((e) => e !== itemId) || [];
        updatedSelections[parentId] = {
          ...selectedItems[parentId],
          childIds: updatedChildren,
        };
        // console.log("updated childIds in parent", updatedChildren, parentId);

        if (getNextAvailableSelection) {
          // follow the selection order and pick the latest selection
          let childId;
          let children = [...updatedChildren];
          childId = children?.[children.length - 1]; //latest selection
          // console.log("potential childId found", childId);

          if (childId && selectedItems[childId]) {
            const otherPath = getConnectedItems(
              menuGroupMap,
              childId,
              updatedSelections
            );
            // console.log("found other path", otherPath);

            return {
              newSelectedItems: otherPath,
              newChildId: childId,
            };
          } else {
            // no childId found, so return the updatedSelections with parentId
            return {
              newSelectedItems: updatedSelections,
              newChildId: parentId,
            };
          }
        }
      }
    } else if (getNextAvailableSelection) {
      /**
       * if there is any other item in the same group having no parent i.e, in the first level
       */
      // TODO: can't use selectedItems as, we should will the group of deleted ids not just item.id
    }
    // TODO, need to return some childId, because activeItemLeaf may be looking for it.
    return { newSelectedItems: updatedSelections };
  } catch (e) {
    console.log(
      "error in highlighting the other selection in the same group",
      e
    );
    return { newSelectedItems: selectedItems };
  }
};

export const getParentGroup = (
  item: SelectedItemType,
  parentId: ItemId
): string => {
  if (item) {
    return (
      Object.values(item).find((e) => e.parentId === parentId)?.parentGroup ||
      ""
    );
  }
  return "";
};

export const initParentSelectedItem = (id: ItemId, groupHeading: string) => {
  return {
    id,
    label: "",
    value: "",
    groupHeading: "",
    childGroup: groupHeading,
    childIds: [],
  };
};

/**
 * convert FormatedSelections to SelectedItemType
 * also, add the top most parent of menugroup to connect all
 */
// export const fromatPreSelections = (
//   menuGroup: MenuGroup,
//   selections: FormatedSelections[] | null
// ) => {
//   const calSelectedItems: SelectedItemType =
//     formatPreSelectionHelper(selections);
//   const calActiveItems = formatPreSelectionHelper(selections, false);

//   if (!selections) return { calcSelectedItems: {}, calcActiveItems: {} };

//   // add top most child to connect all the children to single node
//   const childIds: ItemId[] = selections.reduce(
//     (acc: ItemId[], ele: FormatedSelections): ItemId[] => {
//       if (!ele.id) return acc;
//       return [...acc, ele.id];
//     },
//     []
//   );
//   // console.log("childIds", childIds);

//   const topParentObj = initParentSelectedItem(
//     menuGroup.id,
//     menuGroup.groupHeading
//   );

//   const calcSelectedItems = {
//     [menuGroup.id]: {
//       ...topParentObj,
//       childIds,
//     },
//     ...calSelectedItems,
//   };

//   const calcActiveItems = {
//     [menuGroup.id]: {
//       ...topParentObj,
//       childIds: childIds.length ? [childIds[0]] : [],
//     },
//     ...calActiveItems,
//   };

//   return { calcSelectedItems, calcActiveItems };
// };

export const initPreSelections = (selections: FormatedSelections | null) => {
  const newSelectedItems: SelectedItemTypeV2 = {};
  const newActiveItems = {};

  if (!selections) return { newSelectedItems, newActiveItems };

  const initPreSelectionsHelper = (e: FormatedSelections) => {
    if (!e) return;
    newSelectedItems[e.id] = {
      id: e.id,
      childIds: e.options?.map((e) => e?.id) || [],
    };
    e.options.forEach((opt) => {
      initPreSelectionsHelper(opt);
    });
  };

  initPreSelectionsHelper(selections);

  return { newSelectedItems };
};

/**
 * Cascading item removal(current+children)
 * Removes the current selection and its children selections
 */
export const cascadeSelectionRemoval = (
  obj: MenuGroupMap,
  selectedItems: SelectedItemTypeV2,
  nodeId: ItemId
): SelectedItemTypeV2 => {
  try {
    if (!nodeId) return {};
    const result = { ...selectedItems };

    const cascadeSelectionRemovalHelper = (
      obj: MenuGroupMap,
      selectedItems: SelectedItemTypeV2,
      nodeId: ItemId,
      result: SelectedItemTypeV2
    ) => {
      const childIds = selectedItems[nodeId]?.childIds;
      delete result[nodeId];

      if (childIds) {
        childIds.forEach((childId) => {
          cascadeSelectionRemovalHelper(obj, selectedItems, childId, result);
        });
      }
    };

    cascadeSelectionRemovalHelper(obj, selectedItems, nodeId, result);
    // console.log("cascadeSelectionRemoval", result);
    return result;
  } catch (e) {
    console.log("Issue while remove item", e);
    // setError("Issue while remove item");
    return selectedItems;
  }
};

// /**
//  * get all leaf-nodes with paths through indexes
//  * used for search
//  */
export function getAllLeafNodes(
  treeObj: MenuGroup,
  index: number
): CompleteObj[] {
  try {
    const { label, options } = treeObj;
    if (!options?.length) {
      return [{ label, indexes: [index] }];
    }

    const childRes = options.reduce(
      (acc: CompleteObj[], item, index: number): CompleteObj[] => {
        return [...acc, ...getAllLeafNodes(item, index)];
      },
      []
    );

    return childRes.map((e) => {
      const { label, indexes } = e;
      if (!treeObj.label) {
        return e;
      }
      return {
        label: `${treeObj.label}=>${label}`,
        indexes: [index, ...indexes],
      };
    });
  } catch (e) {
    console.log("error in finding all the leafs", e);
  }
  // not necessary, will not be able to reach this
  return [{ label: treeObj.label, indexes: [index] }];
}
