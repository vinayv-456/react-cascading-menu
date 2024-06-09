import React, { useState } from "react";
import classnames from "classnames";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";
import { getParentGroup } from "../utils";

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
    handleGroupSelection,
    level,
  } = props;
  const { options, groupHeading, id: groupId } = menuGroup;
  const { options: opt, ...parentItemObj } = menuGroup;

  // choose the default value via prop
  const isMultiSelection =
    menuGroup.isMultiSelection !== undefined
      ? menuGroup.isMultiSelection
      : true;

  /**
   *
   * Handled the selection of item
   */

  return (
    <>
      <div
        className={classnames({
          "dropdown-group": true,
        })}
        style={{ left: `${level * 14}rem` }}
      >
        {/* TODO: removed split option, need to review it */}
        {/* <span
          className={classnames({
            "dropdown-heading": true,
          })}
        >
          {groupHeading}
          <input
            type="radio"
            checked={activeItem?.[parentItemObj.id]?.splitAt || false}
            onClick={() => handleGroupSelection(parentItemObj.id)}
          />
        </span> */}
        {options?.length === 0 ? (
          <div className="dropdown-noresults"> {emptyRecordMsg}</div>
        ) : null}
        {options?.map((ele: Item) => {
          const label = isObject ? ele?.[displayValue] : ele;
          const isActive = activeItem?.[ele.id]?.id === ele.id;
          return (
            <>
              <div
                key={ele.id}
                className={classnames({
                  "dropdown-option": true,
                  checkbox: isMultiSelection,
                  radio: !isMultiSelection,
                  "fade-active":
                    !isActive && selectedItems?.[ele.id]?.id === ele.id,
                  active: isActive,
                })}
                onClick={() =>
                  // TODO: use only the part of the parentItemObj
                  handleItemSelection(
                    ele,
                    groupHeading,
                    parentItemObj.id,
                    isMultiSelection
                  )
                }
              >
                <div
                  style={{ width: "100%" }}
                  // className={classnames({
                  //   "fade-active":
                  //     !isActive &&
                  //     selectedItems?.[groupHeading]?.[ele.id]?.id === ele.id,
                  //   active: isActive,
                  // })}
                  // onClick={() =>
                  //   // TODO: use only the part of the parentItemObj
                  //   handleItemSelection(ele, groupHeading, parentItemObj.id)
                  // }
                >
                  {label}
                </div>
              </div>
            </>
          );
        })}
      </div>
      {options?.map((ele: Item) => {
        const isSubMenuActive = activeItem?.[ele.id];
        return (
          <>
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
                handleGroupSelection={handleGroupSelection}
                level={level + 1}
              />
            )}
          </>
        );
      })}
    </>
  );
};

export default DropdownMenu;

DropdownMenu.defaultProps = {
  showNext: true,
};
