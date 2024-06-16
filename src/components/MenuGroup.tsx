import React, { useState } from "react";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";
import { getParentGroup } from "../utils";
import { DropdownGroup, DropdownNoresults, DropdownOption } from "../styles";
import Icons, { ICONS } from "../icons";

const MenuGroupComp: React.FC<DPItemProps> = (props) => {
  const {
    menuGroup,
    activeItem,
    selectedItems,
    displayValue,
    showNext,
    handleItemSelection,
    level,
  } = props;
  const { options, groupHeading, id: groupId } = menuGroup;
  const { options: opt, ...parentItemObj } = menuGroup;

  // choose the default value via prop
  const isMultiSelection =
    menuGroup.isMultiSelection !== undefined
      ? menuGroup.isMultiSelection
      : true;

  const width = 13;
  /**
   *
   * Handled the selection of item
   */
  return (
    <>
      <DropdownGroup width={width} left={level * width}>
        <div className="grp-heading">{menuGroup.groupHeading}</div>
        <div className="grp-opts">
          {options?.map((ele: Item) => {
            const label = ele?.[displayValue];
            const isActive = activeItem?.[ele.id]?.id === ele.id;
            const fadeActive =
              !isActive && selectedItems?.[ele.id]?.id === ele.id;

            return (
              <React.Fragment key={ele.id}>
                <DropdownOption
                  key={ele.id}
                  fadeactive={fadeActive.toString()}
                  active={isActive.toString()}
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
                  <div style={{ width: "100%" }}>{label}</div>
                </DropdownOption>
              </React.Fragment>
            );
          })}
        </div>
      </DropdownGroup>
      {options?.map((ele: Item) => {
        const isSubMenuActive = activeItem?.[ele.id];
        const hasOptions = ele.options;
        return (
          <React.Fragment key={ele.id}>
            {isSubMenuActive && hasOptions && (
              <MenuGroupComp
                menuGroup={ele}
                activeItem={activeItem}
                selectedItems={selectedItems}
                displayValue={displayValue}
                showNext={false}
                handleItemSelection={handleItemSelection}
                level={level + 1}
              />
            )}
          </React.Fragment>
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
            <Icons
              icon={ICONS.CHECKBOX_CHECKED}
              width={35}
              height={28}
              applytheme={false.toString()}
            />
          ) : (
            <Icons
              icon={ICONS.CHECKBOX_UNCHECKED}
              width={35}
              height={28}
              applytheme={false.toString()}
            />
          )}
        </>
      ) : (
        <>
          {isChecked ? (
            <Icons
              icon={ICONS.RADIO_CHECKED}
              width={35}
              height={28}
              applytheme={false.toString()}
            />
          ) : (
            <Icons
              icon={ICONS.RADIO_UNCHECKED}
              width={35}
              height={28}
              applytheme={false.toString()}
            />
          )}
        </>
      )}
    </>
  );
};

MenuGroupComp.defaultProps = {
  showNext: true,
};
