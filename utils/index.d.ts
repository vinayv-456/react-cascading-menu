import { ItemId, SelectedItemType } from "../types";
export declare const getParentGroup: (item: SelectedItemType, groupHeading: string, parentId: ItemId) => string;
export declare const initParentSelectedItem: (id: ItemId, groupHeading: string) => {
    id: ItemId;
    label: string;
    value: string;
    groupHeading: string;
    childGroup: string;
    childIds: never[];
};
