import React, { useState } from "react";
import classes from "react-style-classes";
import classnames from "classnames";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";

const DropdownMenu: React.FC<DPItemProps> = (props) => {
  const {
    menuGroup,
    isObject,
    selectedItems,
    displayValue,
    groupby,
    emptyRecordMsg,
    showNext,
    handleItemSelection,
  } = props;
  const { options, groupHeading, id: groupId } = menuGroup;
  const { options: opt, ...parentItemObj } = menuGroup;
  console.log("menuGroup", menuGroup);

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
        return (
          <>
            <div key={ele.id} className={classes("dropdown-option")}>
              <div
                style={{ width: "100%" }}
                onClick={() =>
                  // TODO: use only the part of the parentItemObj
                  handleItemSelection(ele, groupHeading, parentItemObj)
                }
              >
                {label}
              </div>
              {selectedItems?.[groupHeading]?.[ele.id] && (
                <DropdownMenu
                  menuGroup={ele}
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
