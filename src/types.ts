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

export interface SelectedItemTypeVal {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  parentItemObj: MenuGroup;
}

type ItemId = number | string;

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
  isMultiSelection?: boolean;
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
  selectedItems: SelectedItemType;
  isObject: boolean;
  displayValue: string;
  groupby: string;
  emptyRecordMsg: string;
  showNext: boolean;
  handleItemSelection: (
    item: MenuGroup,
    groupHeading: string,
    parentItemObj: MenuGroup
  ) => void;
}
