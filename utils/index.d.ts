import { FormatedSelections, ItemId, MenuGroup, SelectedItemType } from "../types";
export declare const getParentGroup: (item: SelectedItemType, parentId: ItemId) => string;
export declare const initParentSelectedItem: (id: ItemId, groupHeading: string) => {
    id: ItemId;
    label: string;
    value: string;
    groupHeading: string;
    childGroup: string;
    childIds: never[];
};
/**
 * convert FormatedSelections to SelectedItemType
 * also, add the top most parent of menugroup to connect all
 */
export declare const fromatPreSelections: (menuGroup: MenuGroup, selections: FormatedSelections[] | null) => {
    calcSelectedItems: {
        [x: string]: import("../types").SelectedItemTypeVal | {
            childIds: ItemId[];
            id: ItemId;
            label: string;
            value: string;
            groupHeading: string;
            childGroup: string;
        };
    };
    calcActiveItems: {
        [x: string]: import("../types").SelectedItemTypeVal | {
            childIds: ItemId[];
            id: ItemId;
            label: string;
            value: string;
            groupHeading: string;
            childGroup: string;
        };
    };
};
/**
 * convert FormatedSelections to SelectedItemType
 */
export declare const formatPreSelectionHelper: (selections: FormatedSelections[] | null, isSingle?: boolean) => SelectedItemType;
