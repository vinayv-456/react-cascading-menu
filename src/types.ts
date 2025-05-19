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

export interface SelectedItemTypeValV2 {
  id: ItemId;
  childIds: ItemId[] | null;
}
export interface SelectedItemTypeV2 {
  [id: ItemId]: SelectedItemTypeValV2;
}

export type ItemId = number | string;

export interface SelectedItemType {
  // [grpHeading: string]: {
  [id: ItemId]: SelectedItemTypeVal;
  // };
}

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
  selectedItems?: FormatedSelections[];
  width?: string;
  height?: string;
  displayValue?: string; // read label using this property of menugroup
  theme?: MODES.LIGHT | MODES.DARK;
  selectionColor?: string;
}

export interface DPItemProps {
  menuGroup: MenuGroup;
  activeItem: SelectedItemTypeV2;
  selectedItems: SelectedItemTypeV2;
  displayValue: string;
  showNext: boolean;
  handleItemSelection: (
    item: MenuGroup,
    groupHeading: string,
    parentId: ItemId,
    isMultiSelection: boolean
  ) => void;
  // handleMultipleChildrenSel: (
  //   items: MenuGroup[] | [],
  //   parentId: ItemId,
  //   parentGroup: string,
  //   allItemsChecked: boolean
  // ) => void;
  level: number;
}

export interface mvpSelectedProps {
  label: string;
  id: ItemId;
  value: string;
}

export interface IconType {
  [key: string]: FunctionComponent<SVGAttributes<SVGElement>>;
}

export interface CompleteObj {
  label: string;
  indexes: number[];
}
