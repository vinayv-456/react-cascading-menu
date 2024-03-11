import React, { useState } from "react";
import classes from "react-style-classes";
import classnames from "classnames";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";

const DropdownMenu: React.FC<DPItemProps> = (props) => {
  const {
    menuGroup,
    isObject,
    activeItem,
    selectedItems,
    displayValue,
    groupby,
    emptyRecordMsg,
    showNext,
    handleItemSelection,
  } = props;
  const { options, groupHeading, id: groupId } = menuGroup;
  const { options: opt, ...parentItemObj } = menuGroup;

  /**
   *
   * Handled the selection of item
   */

  return (
    <div
      className={classnames({
        "dropdown-group": true,
      })}
    >
      <span
        className={classnames({
          "dropdown-heading": true,
        })}
      >
        {groupHeading}
      </span>
      {options?.length === 0 ? (
        <div className={classes("dropdown-noresults")}> {emptyRecordMsg}</div>
      ) : null}
      {options?.map((ele: Item) => {
        const label = isObject ? ele?.[displayValue] : ele;
        const isSubMenuActive = activeItem?.[groupHeading]?.[ele.id];
        const isActive = activeItem?.[groupHeading]?.[ele.id]?.id === ele.id;
        return (
          <>
            <div
              key={ele.id}
              className={classnames({
                "dropdown-option": true,
              })}
            >
              <div
                style={{ width: "100%" }}
                className={classnames({
                  "fade-active":
                    !isActive &&
                    selectedItems?.[groupHeading]?.[ele.id]?.id === ele.id,
                  active: isActive,
                })}
                onClick={() =>
                  // TODO: use only the part of the parentItemObj
                  handleItemSelection(ele, groupHeading, parentItemObj)
                }
              >
                {label}
              </div>
              {isSubMenuActive && (
                <DropdownMenu
                  menuGroup={ele}
                  activeItem={activeItem}
                  selectedItems={selectedItems}
                  isObject={isObject}
                  displayValue={displayValue}
                  groupby={groupby}
                  emptyRecordMsg={emptyRecordMsg}
                  showNext={false}
                  handleItemSelection={handleItemSelection}
                />
              )}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default DropdownMenu;

DropdownMenu.defaultProps = {
  showNext: true,
};
