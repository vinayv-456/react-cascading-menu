import React from "react";
import { mvpSelectedProps } from "../types";
import "../classes.css";
interface Props {
    leafNodes: mvpSelectedProps[][];
    handleTagRemoval: (selectionPath: mvpSelectedProps[]) => void;
    handleSelectionPopulation: (selectionPath: mvpSelectedProps[]) => void;
}
declare function Tags(props: Props): React.JSX.Element;
export default Tags;
