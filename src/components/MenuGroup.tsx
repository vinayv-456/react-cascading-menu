import React, { useState } from "react";
import classnames from "classnames";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";
import { getParentGroup } from "../utils";
import { DropdownGroup, DropdownNoresults, DropdownOption } from "../styles";
import Icons, { ICONS } from "../icons";

const MenuGroupComp: React.FC<DPItemProps> = (props) => {
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
      <DropdownGroup left={level * 15}>
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
          <DropdownNoresults> {emptyRecordMsg}</DropdownNoresults>
        ) : null}
        <div className="grp-heading">{menuGroup.groupHeading}</div>
        {options?.map((ele: Item) => {
          const label = isObject ? ele?.[displayValue] : ele;
          const isActive = activeItem?.[ele.id]?.id === ele.id;
          const fadeActive =
            !isActive && selectedItems?.[ele.id]?.id === ele.id;
          return (
            <>
              <DropdownOption
                key={ele.id}
                fadeActive={fadeActive}
                active={isActive}
                // className={`${!isMultiSelection ? "radio" : ""} ${
                //   isMultiSelection ? "checkbox" : ""
                // } opt-label`}
                className="opt-label"
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
                <SelectionIcon
                  isMultiSelection={isMultiSelection}
                  isChecked={isActive || fadeActive}
                />
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
              </DropdownOption>
            </>
          );
        })}
      </DropdownGroup>
      {options?.map((ele: Item) => {
        const isSubMenuActive = activeItem?.[ele.id];
        return (
          <>
            {isSubMenuActive && (
              <MenuGroupComp
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

export default MenuGroupComp;

interface SelectionIconProps {
  isMultiSelection: boolean;
  isChecked: boolean;
}
const SelectionIcon = ({ isMultiSelection, isChecked }: SelectionIconProps) => {
  return (
    <>
      {isMultiSelection ? (
        <>
          {isChecked ? (
            <Icons icon={ICONS.CHECKBOX_CHECKED} width={35} height={28} />
          ) : (
            <Icons icon={ICONS.CHECKBOX_UNCHECKED} width={35} height={28} />
          )}
        </>
      ) : (
        <>
          {isChecked ? (
            <Icons icon={ICONS.RADIO_CHECKED} width={35} height={28} />
          ) : (
            <Icons icon={ICONS.RADIO_UNCHECKED} width={35} height={28} />
          )}
        </>
      )}
    </>
  );
};

MenuGroupComp.defaultProps = {
  showNext: true,
};
