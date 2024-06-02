import { Item, ItemId, SelectedItemType } from "../types";

export const getParentGroup = (
  item: SelectedItemType,
  groupHeading: string,
  parentId: ItemId
): string => {
  if (item[groupHeading]) {
    return (
      Object.values(item[groupHeading]).find((e) => e.parentId === parentId)
        ?.parentGroup || ""
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
