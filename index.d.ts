import React from "react";
import { Props, FormatedSelections } from "./types";
import "@fortawesome/fontawesome-free/css/all.min.css";
export interface CascadingMenuRef {
    getSelection: () => ({} | FormatedSelections)[];
    getAllItemsSelectedBySplit: () => string[][][];
    getAllItemsSelected: () => string[][];
}
declare const Index: React.ForwardRefExoticComponent<Props & React.RefAttributes<CascadingMenuRef>>;
export default Index;
