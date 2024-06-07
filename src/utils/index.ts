import { Item, ItemId, SelectedItemType } from "../types";

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
