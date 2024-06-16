import { FunctionComponent, SVGAttributes } from "react";
type ItemObj = {
    label: string;
    value: string;
};
export type Item = ItemObj | string | any;
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
    parentGroup?: string;
    parentId?: ItemId;
    childGroup?: string;
    childIds?: ItemId[] | null;
    isMultiSelection?: boolean;
}
export type ItemId = number | string;
export interface SelectedItemType {
    [id: ItemId]: SelectedItemTypeVal;
}
export declare enum MODES {
    LIGHT = "light",
    DARK = "dark"
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
    displayValue?: string;
    theme?: MODES.LIGHT | MODES.DARK;
    selectionColor?: string;
}
export interface DPItemProps {
    menuGroup: MenuGroup;
    activeItem: SelectedItemType;
    selectedItems: SelectedItemType;
    displayValue: string;
    showNext: boolean;
    handleItemSelection: (item: MenuGroup, groupHeading: string, parentId: ItemId, isMultiSelection: boolean) => void;
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
export {};
