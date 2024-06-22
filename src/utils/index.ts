import {
  FormatedSelections,
  Item,
  ItemId,
  MenuGroup,
  SelectedItemType,
  SelectedItemTypeVal,
} from "../types";

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
export const fromatPreSelections = (
  menuGroup: MenuGroup,
  selections: FormatedSelections[] | null
) => {
  const calSelectedItems: SelectedItemType =
    formatPreSelectionHelper(selections);
  const calActiveItems = formatPreSelectionHelper(selections, false);

  if (!selections) return { calcSelectedItems: {}, calcActiveItems: {} };

  // add top most child to connect all the children to single node
  const childIds: ItemId[] = selections.reduce(
    (acc: ItemId[], ele: FormatedSelections): ItemId[] => {
      if (!ele.id) return acc;
      return [...acc, ele.id];
    },
    []
  );
  // console.log("childIds", childIds);

  const topParentObj = initParentSelectedItem(
    menuGroup.id,
    menuGroup.groupHeading
  );

  const calcSelectedItems = {
    [menuGroup.id]: {
      ...topParentObj,
      childIds,
    },
    ...calSelectedItems,
  };

  const calcActiveItems = {
    [menuGroup.id]: {
      ...topParentObj,
      childIds: childIds.length ? [childIds[0]] : [],
    },
    ...calActiveItems,
  };

  return { calcSelectedItems, calcActiveItems };
};
/**
 * convert FormatedSelections to SelectedItemType
 */
export const formatPreSelectionHelper = (
  selections: FormatedSelections[] | null,
  isSingle: boolean = true
): SelectedItemType => {
  if (!selections) return {};
  const res = selections.reduce((acc1, ele1) => {
    const { options, ...rest } = ele1;
    if (!ele1.id) return acc1;
    return {
      ...acc1,
      [ele1.id]: rest,
      ...formatPreSelectionHelper(
        isSingle ? options : options?.[0] ? [options?.[0]] : [],
        isSingle
      ),
    };
  }, {});
  return res;
};

/**
 * Cascading item removal(current+children)
 * Removes the current selection and its children selections
 */
export const cascadeSelectionRemoval = (
  cummSelections: SelectedItemType,
  groupHeading: string,
  item: MenuGroup
): SelectedItemType => {
  try {
    if (!item) return {};
    const { id } = item;
    const updatedSelections = cummSelections;
    const { childGroup, childIds }: SelectedItemTypeVal =
      updatedSelections?.[id] || {};
    delete updatedSelections?.[id];
    if (childGroup && childIds) {
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
    // setError("Issue while remove item");
    return cummSelections;
  }
};
