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

export interface MenuGroupMapVal {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  childIds?: ItemId[] | null;
  parentId?: ItemId;
  isMultiSelection?: boolean;
}

export interface MenuGroupMap {
  [id: ItemId]: MenuGroupMapVal;
}

export interface FormatedSelections {
  id: ItemId;
  label: string;
  value: string;
  groupHeading: string;
  parentGroup?: string;
  parentId?: ItemId;
  childGroup?: string;
  childIds?: ItemId[];
  options: FormatedSelections[];
}

export type emptyObj = {};

export interface SelectedItemTypeVal {
  id: ItemId;
  childIds: ItemId[] | null;
}
export interface SelectedItemType {
  [id: ItemId]: SelectedItemTypeVal;
}

export type ItemId = number | string;

export enum MODES {
  LIGHT = "light",
  DARK = "dark",
}
/**
 * update:
 *  selectionLimit?: number;
 */
export interface Props {
  menuGroup: MenuGroup;
  selectedItems?: FormatedSelections | null;
  width?: string;
  height?: string;
  displayValue?: string; // read label using this property of menugroup
  theme?: MODES.LIGHT | MODES.DARK;
  selectionColor?: string;
}

export interface DPItemProps {
  menuGroup: MenuGroup;
  activeItem: SelectedItemType;
  selectedItems: SelectedItemType;
  displayValue: string;
  showNext: boolean;
  handleItemSelection: (
    item: MenuGroup,
    groupHeading: string,
    parentId: ItemId,
    isMultiSelection: boolean
  ) => void;
  handleMultipleChildrenSel: (
    items: MenuGroup[] | [],
    parentId: ItemId,
    allItemsChecked: boolean
  ) => void;
  level: number;
}

export interface IconType {
  [key: string]: FunctionComponent<SVGAttributes<SVGElement>>;
}

export interface CompleteObj {
  label: string;
  indexes: number[];
}
