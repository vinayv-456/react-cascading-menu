import {
  ItemId,
  MenuGroupMap,
  SelectedItemType,
  SelectedItemTypeV2,
} from "../types";

export const checkSelections = (
  menuObj: MenuGroupMap,
  selectionObj: SelectedItemTypeV2,
  topParentId: ItemId,
  isActiveItem: boolean
): boolean => {
  // check if the childIds are matching with the actual child options
  let ids = [topParentId];
  while (ids.length > 0) {
    const topmostId = ids.pop();
    // console.log("ids", ids, topmostId);
    // the id is not present, which means there is an error
    if (!topmostId || !selectionObj[topmostId]) {
      console.log("1");
      return false;
    }

    const newIds = selectionObj[topmostId].childIds;
    if (topmostId !== topParentId) {
      // checks if all the childs are having correct parentId
      const isCorrectParent = newIds?.some(
        (e) => menuObj[e]?.parentId !== topmostId
      );
      if (isCorrectParent) {
        console.log("===2===");
        return false;
      }
    }
    // if the no of childs are more than 1
    if (isActiveItem && newIds && newIds.length > 1) {
      console.log("3");
      return false;
    }
    // add the newIds to the stack
    if (newIds?.length) {
      ids = [...ids, ...newIds];
    }
  }
  return true;
};
