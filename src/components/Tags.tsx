import React from "react";
import { ItemId, MenuGroupMap } from "../types";
import "../classes.css";
import { TagHover, TagItem, TagLabel } from "../styles";
import Icons, { ICONS } from "../icons";
interface Props {
  leafNodes: ItemId[][];
  handleTagRemoval: (selectionPath: ItemId[]) => void;
  handleSelectionPopulation: (selectionPath: ItemId[]) => void;
  menuGroupMap: MenuGroupMap;
}

function Tags(props: Props) {
  const {
    leafNodes,
    menuGroupMap,
    handleTagRemoval,
    handleSelectionPopulation,
  } = props;

  return (
    <>
      {leafNodes.map((selectionPath) => {
        const leafIndex = selectionPath.length - 1;
        const leafNode = selectionPath[leafIndex];
        const menuItem = menuGroupMap[leafNode];
        if (!menuItem || !menuItem.label) return null;
        const { label: leafNodeLabel, id: leafNodeId } = menuItem;
        return (
          <TagItem key={leafNodeId}>
            <TagLabel onClick={() => handleSelectionPopulation(selectionPath)}>
              {leafNodeLabel}
            </TagLabel>
            <TagHover>
              {selectionPath.map((e, index) => {
                if (index === 0) return "";
                const item = menuGroupMap[e];
                if (!item) return "";
                if (index === leafIndex) return item.label;
                return `${item.label} => `;
              })}
            </TagHover>
            <span
              className="cancel-icon"
              onClick={() => handleTagRemoval(selectionPath)}
            >
              <Icons icon={ICONS.CANCEL} width={10} height={10} />
            </span>
          </TagItem>
        );
      })}
    </>
  );
}

export default Tags;
