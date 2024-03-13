type ItemObj = {
  label: string;
  value: string;
};

export interface ClassNames {
  baseClassName?: string;
  controlClassName?: string;
  placeholderClassName?: string;
  menuClassName?: string;
  arrowClassName?: string;
  arrowClosed?: string;
  arrowOpen?: string;
  className?: string;
}

export type Item = ItemObj | string | any; // any - as item can any number of key-value pairs

export interface MenuGroup {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  options?: MenuGroup[];
}

export interface parentGroupLookUp {
  [childGrp: string]: string;
}
export interface SelectedItemTypeVal {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  // connecting front and back to traversing from one to another
  parentGroup?: string;
  parentId?: ItemId;
  childGroup?: string;
  childIds?: ItemId[];
}

export type ItemId = number | string;

export interface SelectedItemType {
  [grpHeading: string]: {
    [id: ItemId]: SelectedItemTypeVal;
  };
}

export interface Ref {
  test: () => void;
}

export interface Props {
  menuGroup: MenuGroup;
  selectedItems: Item;
  isObject: boolean;
  displayValue: string;
  groupby: string;
  caseSensitiveSearch?: boolean;
  isMultiSelection: boolean;
  keepSearchTerm?: boolean;
  emptyRecordMsg: string;
  selectionLimit: number;
  targetClassNames?: ClassNames;
  showCheckbox?: boolean;
  closeIconType?: string;
  disablePreSelectedValues?: boolean;
}

export interface DPItemProps {
  menuGroup: MenuGroup;
  activeItem: SelectedItemType;
  selectedItems: SelectedItemType;
  isObject: boolean;
  displayValue: string;
  groupby: string;
  emptyRecordMsg: string;
  showNext: boolean;
  handleItemSelection: (
    item: MenuGroup,
    groupHeading: string,
    parentId: ItemId
  ) => void;
  level: number;
}
