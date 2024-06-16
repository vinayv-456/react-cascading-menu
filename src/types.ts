import { FunctionComponent, SVGAttributes } from "react";

type ItemObj = {
  label: string;
  value: string;
};

export type Item = ItemObj | string | any; // any - as item can any number of key-value pairs

export interface MenuGroup {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  options?: MenuGroup[] | null;
  isMultiSelection?: boolean;
}

export interface parentGroupLookUp {
  [childGrp: string]: string;
}

export interface FormatedSelections {
  id: number;
  label: string;
  value: string;
  groupHeading: string;
  parentGroup?: string;
  parentId?: ItemId;
  childGroup?: string;
  childIds?: ItemId[];
  options: FormatedSelections[] | null;
}

export type emptyObj = {};
export interface SelectedItemTypeVal {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  // connecting front and back to traversing from one to another
  parentGroup?: string;
  parentId?: ItemId;
  childGroup?: string;
  childIds?: ItemId[] | null;
  isMultiSelection?: boolean; // used during bulk addition
}

export type ItemId = number | string;

export interface SelectedItemType {
  // [grpHeading: string]: {
  [id: ItemId]: SelectedItemTypeVal;
  // };
}

export interface Props {
  menuGroup: MenuGroup;
  selectedItems?: Item;
  width?: string;
  height?: string;
  isObject?: boolean;
  displayValue?: string;
  groupby?: string;
  caseSensitiveSearch?: boolean;
  isMultiSelection: boolean;
  keepSearchTerm?: boolean;
  emptyRecordMsg?: string;
  selectionLimit?: number;
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
    parentId: ItemId,
    isMultiSelection: boolean
  ) => void;
  level: number;
}

export interface mvpSelectedProps {
  label: string;
  id: ItemId;
  value: string;
}

export interface IconType {
  [iconUrl: string]: FunctionComponent<SVGAttributes<SVGElement>>;
}

export interface CompleteObj {
  label: string;
  indexes: number[];
}
