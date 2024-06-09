import React from "react";
import { mvpSelectedProps } from "../types";
import "../classes.css";
import { TagContainer, TagHover, TagItem, TagLabel } from "../styles";

interface Props {
  leafNodes: mvpSelectedProps[][];
  handleTagRemoval: (selectionPath: mvpSelectedProps[]) => void;
  handleSelectionPopulation: (selectionPath: mvpSelectedProps[]) => void;
}

function Tags(props: Props) {
  const { leafNodes, handleTagRemoval, handleSelectionPopulation } = props;

  return (
    <TagContainer>
      {leafNodes.map((selectionPath) => {
        const leafIndex = selectionPath.length - 1;
        const leafNode = selectionPath[leafIndex];
        return (
          <TagItem key={leafNode.id}>
            <TagLabel onClick={() => handleSelectionPopulation(selectionPath)}>
              {leafNode.label}
            </TagLabel>
            <TagHover>
              {selectionPath.map((e, index) => {
                if (index === 0) return "";
                if (index === leafIndex) return e.label;
                return `${e.label} => `;
              })}
            </TagHover>
            <button onClick={() => handleTagRemoval(selectionPath)}>
              remove
            </button>
          </TagItem>
        );
      })}
    </TagContainer>
  );
}

export default Tags;
