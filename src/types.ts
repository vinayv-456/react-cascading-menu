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

export interface Ref {
  test: () => void;
}

export interface Props {
  options: Item[];
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
  options: Item[];
  isObject: boolean;
  displayValue: string;
  groupby: string;
  emptyRecordMsg: string;
}
