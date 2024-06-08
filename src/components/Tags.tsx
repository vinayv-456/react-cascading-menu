import React from "react";
import { mvpSelectedProps } from "../types";
import "../classes.css";

interface Props {
  leafNodes: mvpSelectedProps[][];
  handleTagRemoval: (selectionPath: mvpSelectedProps[]) => void;
  handleSelectionPopulation: (selectionPath: mvpSelectedProps[]) => void;
}

function Tags(props: Props) {
  const { leafNodes, handleTagRemoval, handleSelectionPopulation } = props;

  return (
    <div className="tag-container">
      {leafNodes.map((selectionPath) => {
        const leafIndex = selectionPath.length - 1;
        const leafNode = selectionPath[leafIndex];
        return (
          <div className="tag-item" key={leafNode.id}>
            <span
              className="tag-label"
              onClick={() => handleSelectionPopulation(selectionPath)}
            >
              {leafNode.label}
            </span>
            <span className="tag-hover">
              {selectionPath.map((e, index) => {
                if (index === 0) return "";
                if (index === leafIndex) return e.label;
                return `${e.label} => `;
              })}
            </span>
            <button onClick={() => handleTagRemoval(selectionPath)}>
              remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Tags;
