import React from "react";
import { CompleteObj, ItemId, MenuGroup, SelectedItemType } from "../types";
interface Props {
    allItems: CompleteObj[];
    menuGroup: MenuGroup;
    handleBulkAddition: (selectedItems: SelectedItemType, leadId: ItemId) => void;
}
declare function Search(props: Props): React.JSX.Element;
export default Search;
